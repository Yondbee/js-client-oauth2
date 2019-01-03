/* global describe, it */
var chai = require('chai')
var expect = chai.expect
var config = require('./support/config')
var ClientOAuth2 = require('../')

chai.use(require('chai-string'));

describe('credentials', function () {
  var githubAuth = new ClientOAuth2({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    accessTokenUri: config.accessTokenUri,
    redirectUri: config.redirectUri,
    authorizationGrants: ['credentials']
  })

  describe('#getToken', function () {
    it('should request the token', function () {
      return githubAuth.credentials.getToken()
        .then(function (user) {
          expect(user).to.an.instanceOf(ClientOAuth2.Token)
          expect(user.accessToken).to.be.a('string').that.has.lengthOf.at.least(64)
          expect(user.tokenType).to.equal('bearer')
        })
    })

    describe('#sign', function () {
      it('should be able to sign a standard request object', function () {
        return githubAuth.credentials.getToken()
          .then(function (token) {
            var obj = token.sign({
              method: 'GET',
              url: 'http://api.github.com/user'
            })

            expect(obj.headers.Authorization).to.be.a('string').that.startsWith('Bearer ')
          })
      })
    })

    describe('#refresh', function () {
      it('should make a request to get a new access token', function () {
        return githubAuth.credentials.getToken()
          .then(function (token) {
            return token.refresh()
          })
          .then(function (token) {
            expect(token).to.an.instanceOf(ClientOAuth2.Token)
            expect(token.accessToken).to.equal(config.refreshAccessToken)
            expect(token.tokenType).to.equal('bearer')
          })
      })
    })
  })
})
