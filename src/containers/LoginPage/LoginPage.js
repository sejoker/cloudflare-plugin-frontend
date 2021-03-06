import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Button } from 'cf-component-button';
import { Box } from 'cf-component-box';
import { Form, FormHeader, FormFieldset, FormLabel } from 'cf-component-form';
import Input from 'cf-component-input';
import { LayoutContainer, LayoutRow, LayoutColumn } from 'cf-component-layout';

import { asyncAPILogin, asyncLogin } from '../../actions/user';
import {
  CLOUDFLARE_SIGNUP_PAGE,
  CLOUDFLARE_ACCOUNT_PAGE,
  SIGN_UP_PAGE,
  CLOUDFLARE_FORGOT_PASSWORD_PAGE,
  HOME_PAGE
} from '../../constants/UrlPaths.js';
import { getConfigValue } from '../../selectors/config';
import { isLoggedIn } from '../../utils/Auth/Auth';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { openWindow720x720 } from '../../utils/utils.js';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      secret: ''
    };
  }

  componentWillMount() {
    let { dispatch } = this.props;
    if (isLoggedIn()) {
      dispatch(push(HOME_PAGE));
    }
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handleSecretChange(event) {
    this.setState({ secret: event.target.value });
  }

  handleLoginSubmit(e) {
    e.preventDefault();
    const { dispatch, config } = this.props;

    let isHostAPILogin = getConfigValue(config, 'useHostAPILogin');
    if (isHostAPILogin) {
      //secret is the password here
      dispatch(asyncLogin(this.state.email, this.state.secret));
    } else {
      //secret is the API Key here
      dispatch(asyncAPILogin(this.state.email, this.state.secret));
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { config } = this.props;

    //client login defaults
    let title = 'component.clientLogin.form.title';
    let inputType = 'text';
    let inputLabel = 'component.clientLogin.form.apiKey';
    let loginButtonText = 'component.clientLogin.form.button';

    const isHostAPILogin = getConfigValue(config, 'useHostAPILogin');

    if (isHostAPILogin) {
      title = 'component.login.form.title';
      inputType = 'password';
      inputLabel = 'component.login.form.password';
      loginButtonText = 'component.login.form.button';
    }

    var overflowStyle = { overflow: 'hidden' };

    return (
      <div>
        <div
          id="cf-login-page"
          style={{ margin: '2rem auto', maxWidth: '400px' }}
        >
          <Form layout="vertical" onSubmit={e => this.handleLoginSubmit(e)}>
            <LayoutContainer>
              <div style={overflowStyle}>
                <LayoutRow>
                  <LayoutColumn width={1 / 1}>
                    <FormHeader
                      title={formatMessage({ id: title })}
                      style={{ textAlign: 'center' }}
                    />
                  </LayoutColumn>
                </LayoutRow>
              </div>
              <FormFieldset legend="">
                <div style={overflowStyle}>
                  <LayoutRow style={overflowStyle}>
                    <LayoutColumn width={1 / 1}>
                      <FormLabel>
                        <FormattedMessage id="component.clientLogin.form.email" />
                      </FormLabel>
                      <Input
                        name="email"
                        type="text"
                        value={this.state.email}
                        onChange={this.handleEmailChange.bind(this)}
                      />
                    </LayoutColumn>
                  </LayoutRow>
                </div>
                <div style={{ overflow: 'hidden', paddingBottom: '1px' }}>
                  <LayoutRow>
                    <LayoutColumn width={1 / 1}>
                      <FormLabel>
                        <FormattedMessage id={inputLabel} />
                      </FormLabel>
                      <Input
                        name="apiKey"
                        type={inputType}
                        value={this.state.secret}
                        onChange={this.handleSecretChange.bind(this)}
                      />
                    </LayoutColumn>
                  </LayoutRow>
                </div>
                <div style={overflowStyle}>
                  <LayoutRow>
                    <LayoutColumn width={1 / 1}>
                      <Box paddingTop="20px">
                        <Button
                          submit
                          type="success"
                          onClick={e => this.handleLoginSubmit(e)}
                        >
                          <FormattedMessage id={loginButtonText} />
                        </Button>
                      </Box>
                    </LayoutColumn>
                  </LayoutRow>
                </div>
              </FormFieldset>
              <div style={overflowStyle}>
                <div>
                  <LayoutColumn width={1 / 1}>
                    {isHostAPILogin ? (
                      <div>
                        <LayoutColumn width={1 / 2}>
                          <p>
                            <Link className="pull-left" to={SIGN_UP_PAGE}>
                              <FormattedMessage id="component.login.form.signUp" />
                            </Link>
                          </p>
                        </LayoutColumn>
                        <LayoutColumn width={1 / 2}>
                          <p>
                            <Link
                              className="pull-right"
                              href={CLOUDFLARE_FORGOT_PASSWORD_PAGE}
                              target="_blank"
                            >
                              <FormattedMessage id="component.login.form.forgotPassword" />
                            </Link>
                          </p>
                        </LayoutColumn>
                      </div>
                    ) : (
                      <div>
                        <p style={{ textAlign: 'center' }}>
                          <FormattedMessage id="component.clientLogin.cloudflare.description" />{' '}
                          <a
                            onClick={openWindow720x720.bind(
                              this,
                              CLOUDFLARE_SIGNUP_PAGE
                            )}
                          >
                            cloudflare.com
                          </a>
                          .{' '}
                          <FormattedMessage id="component.clientLogin.form.alreadyHaveAccount" />
                          <Box display="block">
                            <FormattedMessage id="component.clientLogin.form.getApiKey" />{' '}
                            <a
                              onClick={openWindow720x720.bind(
                                this,
                                CLOUDFLARE_ACCOUNT_PAGE
                              )}
                            >
                              here
                            </a>
                            .
                          </Box>
                        </p>
                      </div>
                    )}
                  </LayoutColumn>
                </div>
              </div>
            </LayoutContainer>
          </Form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    config: state.config
  };
}

export default injectIntl(connect(mapStateToProps)(LoginPage));
