import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { wallet } from '@cityofzion/neon-js'
import Box from '../../components/common/Box'
import PrimaryButton from '../../components/common/buttons/PrimaryButton'

import style from './ExportWallet.css'

export default class ExportWallet extends Component {
  state = {
    errorMsg: '',
  }

  exportWallet = event => {
    event.preventDefault()

    const { accounts } = this.props

    try {
      const walletObject = new wallet.Wallet({ name: 'neoLinkWallet', accounts: Object.values(accounts) })

      // eslint-disable-next-line no-undef
      const blob = new Blob([JSON.stringify(walletObject.export())], { type: 'text/plain' })
      // eslint-disable-next-line no-undef
      const url = URL.createObjectURL(blob)

      chrome.downloads.download(
        {
          url: url,
          filename: 'NeoLinkWallet.json',
          saveAs: true,
        },
        downloadId => {
          if (!downloadId) {
            this.setState({
              // eslint-disable-next-line no-undef
              errorMsg: runtime.lastError,
            })
          }
        }
      )
    } catch (e) {
      this.setState({
        errorMsg: e.message,
      })
    }
  }

  render() {
    const { errorMsg } = this.state
    const { accounts } = this.props

    if (Object.keys(accounts).length === 0) {
      return <div>You have no stored accounts</div>
    }

    return (
      <section className={ style.exportWallet }>
        <Box>
          <h1>Export Wallet</h1>
          <p className={ style.exportWalletParagraph }>
            Export your wallets private keys, to a JSON format that you can import into other wallets. Never give this
            file to anyone.
          </p>
          <form onSubmit={ this.exportWallet }>
            <div>
              <PrimaryButton buttonText='Export wallet' />
            </div>
          </form>

          <div className='content'>{this.state.errorMsg !== '' && <div>ERROR: {errorMsg}</div>}</div>
        </Box>
      </section>
    )
  }
}

ExportWallet.propTypes = {
  accounts: PropTypes.object.isRequired,
}
