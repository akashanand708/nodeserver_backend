export default {
	'swagger': '3.0.9',
	'info': {
		'version': '1.0.0',
		'title': '',
		'description': '',
		'license': {
			'name': '',
			'url': ''
		}
	},
	'host': 'localhost:5001',
	'basePath': '/api/v1',
	'tags': [
		{
			'name': 'Auth',
			'description': 'API for users authentication'
		}
	],
	'schemes': [
		'http'
	],
	'consumes': [
		'application/json'
	],
	'produces': [
		'application/json'
	],
	'paths': {
		'/register': {
			'post': {
				'tags': [
					'Users'
				],
				'description': 'Register new user in the system',
				'parameters': [
					{
						'name': 'user',
						'in': 'body',
						'description': 'User that we want to register',
						'schema': {
							'$ref': '#/definitions/UserRegistration'
						}
					}
				],
				'produces': [
					'application/json'
				],
				'responses': {
					'200': {
						'description': 'New user is created',
						'schema': {
							'$ref': '#/definitions/ResponseLoginLogout'
						}
					}
				}
			}
		},
		'/login': {
			'patch': {
				'tags': [
					'Users'
				],
				'description': 'User login',
				'parameters': [
					{
						'name': 'user',
						'in': 'body',
						'description': 'User that we want to login',
						'schema': {
							'$ref': '#/definitions/UserLogin'
						}
					}
				],
				'produces': [
					'application/json'
				],
				'responses': {
					'200': {
						'description': 'User logged in.',
						'schema': {
							'$ref': '#/definitions/ResponseLoginLogout'
						}
					}
				}
			}
		},
		'/logout': {
			'delete': {
				'tags': [
					'Users'
				],
				'description': 'User logout',
				'parameters': [
					{
						'name': 'email',
						'in': 'header',
						'description': 'User email address'
					},
					{
						'name': 'x-access-token',
						'in': 'header',
						'description': 'Logged in token'
					}
				],
				'produces': [
					'application/json'
				],
				'responses': {
					'200': {
						'description': 'User logged out',
						'schema': {
							'$ref': '#/definitions/ResponseLoginLogout'
						}
					}
				}
			}
		},
		'/resetPassword': {
			'patch': {
				'tags': [
					'Users'
				],
				'description': 'User reset password',
				'parameters': [
					{
						'name': 'email',
						'in': 'body',
						'description': 'User email address',
						'schema': {
							'$ref': '#/definitions/ResetPassword'
						}
					}
				],
				'produces': [
					'application/json'
				],
				'responses': {
					'200': {
						'description': 'Password reset',
						'schema': {
							'$ref': '#/definitions/CommonResponse'
						}
					}
				}
			}
		},
		'/updatePassword': {
			'patch': {
				'tags': [
					'Users'
				],
				'description': 'Update user password',
				'parameters': [
					{
						'name': 'email',
						'in': 'query',
						'description': 'User email address'
					},
					{
						'name': 'resetToken',
						'in': 'query',
						'description': 'Reset token'
					},
					{
						'name': 'updatedPassword',
						'in': 'body',
						'description': 'Updated password',
						'schema': {
							'$ref': '#/definitions/UpdatePassword'
						}
					}
				],
				'produces': [
					'application/json'
				],
				'responses': {
					'200': {
						'description': 'Password updated.',
						'schema': {
							'$ref': '#/definitions/CommonResponse'
						}
					}
				}
			}
		},

	},
	'definitions': {
		'UserRegistration': {
			'required': [
				'name',
				'email',
				'password'
			],
			'properties': {
				'name': {
					'type': 'string'
				},
				'email': {
					'type': 'string',
					'uniqueItems': true
				},
				'password': {
					'type': 'string'
				}
			}
		},
		'UserLogin': {
			'required': [
				'email',
				'password'
			],
			'properties': {
				'email': {
					'type': 'string',
					'uniqueItems': true
				},
				'password': {
					'type': 'string'
				}
			}
		},
		'UserLogout': {
			'required': [
				'email',
				'token'
			],
			'properties': {
				'email': {
					'type': 'string',
					'uniqueItems': true
				},
				'token': {
					'type': 'string'
				}
			}
		},
		'ResetPassword': {
			'required': [
				'email'
			],
			'properties': {
				'email': {
					'type': 'string',
					'uniqueItems': true
				}
			}
		},
		'UpdatePassword': {
			'required': [
				'updatedPassword'
			],
			'properties': {
				'updatedPassword': {
					'type': 'string',
					'uniqueItems': true
				}
			}
		},
		'CommonResponse': {
			'properties': {
				'code': {
					'type': 'string',
				},
				'message': {
					'type': 'string'
				}
			}
		},
		'ResponseLoginLogout': {
			'properties': {
				'code': {
					'type': 'string',
				},
				'message': {
					'type': 'string'
				},
				'token': {
					'type': 'string/null',
				},
				'email': {
					'type': 'string'
				}
			}
		},
		'Users': {
			'type': 'array',
			'$ref': '#/definitions/User'
		}
	}
};