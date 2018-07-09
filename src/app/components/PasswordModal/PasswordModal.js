import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { wallet } from '@cityofzion/neon-js'
import { Field, reduxForm } from 'redux-form'

import PrimaryButton from '../common/buttons/PrimaryButton'
import Box from '../common/Box'
import Loader from '../Loader'

import withForm from '../HoC/withForm'

import style from './PasswordModal.css'

import { logDeep } from '../../utils/debug'

export class PasswordModal extends Component {
  state = {
    loading: false,
    encryptedWif: '',
    passPhrase: '',
  }

  handleSubmit = (values, dispatch, formProps) => {
    const { clearFormFieldError, encryptedWif, successHandler } = this.props
    const { reset } = formProps
    const passPhrase = values.passPhrase

    this.setState(
      {
        loading: true,
      },
      () => clearFormFieldError('passPhrase')
    )

    const {
      setFormFieldError,
    } = this.props

    console.log('encryptedWif: ' + encryptedWif)
    console.log('werd: ' + passPhrase)

    wallet
      .decryptAsync(encryptedWif, passPhrase)
      .then(wif => {
        reset()
        // setAccount(encryptedWif, account.address)
        successHandler(wif)

        // this.setState({ loading: false })
        // history.push('/home')
        //
        // getBalance(networks, selectedNetworkId, account).then(results => {
        //   setBalance(results.neo, results.gas)
        // })
        // getTransactions(networks, selectedNetworkId, account).then(transactions => setTransactions(transactions))
      })

      .catch(e => {
        this.setState({ loading: false }, () => setFormFieldError('passPhrase', 'Wrong password'))
      })
  }

  getAccountOptions(accounts) {
    const options = [{ label: 'Select Account', value: '' }]

    Object.keys(accounts).forEach(index => {
      const accountn = accounts[index]
      options.push({ label: accountn.label, value: accountn.key })
    })
    return options
  }

  getSelectedValue(accounts) {
    const { account } = this.props
    const options = [{ label: 'd Account', value: '' }]
    let selected = options

    Object.keys(accounts).forEach(index => {
      const accountn = accounts[index]
      // console.log('account: ', accountn.label + '  ' + accountn.key)
      // logDeep('aa: ', account)
      // logDeep('ac ', accountn)
      options.push({ label: accountn.label, value: accountn.key })
      console.log('account: ', accountn.label + '  ' + accountn.key)

      if (account.address === accountn.address) selected = [{ label: accountn.label, value: accountn.key }]
    })
    logDeep('sel', selected)
    return selected
  }

  render() {
    const { loading } = this.state
    const { handleSubmit, errors, renderTextField, accountLabel } = this.props

    if (loading) {
      return <Loader />
    }

    // if (Object.keys(accounts).length === 0) {
    //   console.log('going to start')
    //   return <StartPage />
    // }
    // const accountDropDownMarkup = <AccountInfoDropdownContent address={ address } />

    return (
      <section className={ style.Wrapper }>
        <Box>
          <h1 className={ style.Heading }>Confirm Transaction</h1>
          <form onSubmit={ handleSubmit(this.handleSubmit) } className={ style.Form }>
            <div className={ style.label }>
              <span className={ style.label }>Account: </span>
              <span className={ style.label }>{ accountLabel }</span>
            </div>
            <Field
              label='password'
              component={ renderTextField }
              type='password'
              name='passPhrase'
              id='passPhrase'
              error={ errors.passPhrase }
            />
            <div>
              <PrimaryButton classNames={ style.Button } buttonText={ 'Authorize' } />
            </div>
          </form>
        </Box>
      </section>
    )
  }
}

PasswordModal.propTypes = {
  account: PropTypes.object.isRequired,
  accountLabel: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  clearFormFieldError: PropTypes.func.isRequired,
  setFormFieldError: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  successHandler: PropTypes.func,
  encryptedWif: PropTypes.string.isRequired,
}

export default reduxForm({ form: 'login', destroyOnUnmount: false })(withForm(PasswordModal))