import Button from 'antd/lib/button';
import Layout from 'antd/lib/layout';
import { Content } from 'antd/lib/layout/layout';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { KEYRING_CLASS } from '@/shared/constant';
import CHeader from '@/ui/components/CHeader';
import { useAccountAddress, useCurrentAccount } from '@/ui/state/accounts/hooks';
import { accountActions } from '@/ui/state/accounts/reducer';
import { useAppDispatch } from '@/ui/state/hooks';
import { useCurrentKeyring } from '@/ui/state/keyrings/hooks';
import { keyringsActions } from '@/ui/state/keyrings/reducer';
import { shortAddress, useWallet } from '@/ui/utils';
import { faCircleExclamation, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useNavigate } from '../MainRoute';

function AlertPanel({ visible, onCancel }) {
  const { t } = useTranslation();
  const wallet = useWallet();
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const currentKeyring = useCurrentKeyring();
  const dispatch = useAppDispatch();

  if (!visible) return null;
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <div
        style={{ position: 'absolute', backgroundColor: 'black', opacity: 0.4, width: '100%', height: '100%' }}></div>
      <div className="absolute bottom-auto right-auto z-50 p-5 -translate-x-1/2 -translate-y-1/2 border-0 rounded top-1/2 left-1/2 -mr-1/2 bg-soft-black">
        <div className="flex flex-col items-center mx-auto mt-10 gap-2_5 w-110">
          <div
            style={{
              width: '6rem',
              height: '6rem',
              borderRadius: '3rem',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: '#CC3333',
              justifyContent: 'center'
            }}>
            <FontAwesomeIcon icon={faCircleExclamation} style={{ height: '2.4rem' }} />
          </div>

          <span className="mt-6 text-2xl">{t('Are you Sure')}?</span>
          <div className="grid w-full grid-cols-2 gap-2_5">
            <div
              className="cursor-pointer box unit bg-soft-black hover:border-white hover:border-opacity-40 hover:bg-primary-active"
              onClick={(e) => {
                if (onCancel) {
                  onCancel();
                }
              }}>
              &nbsp;{t('Cancel')}
            </div>

            <div
              className="cursor-pointer box unit ant-btn-dangerous hover:border-white hover:border-opacity-40"
              onClick={async () => {
                const nextKeyring = await wallet.removeKeyring(currentKeyring);
                if (nextKeyring) {
                  const keyrings = await wallet.getKeyrings();
                  dispatch(keyringsActions.setKeyrings(keyrings));
                  dispatch(keyringsActions.setCurrent(keyrings[0]));
                  dispatch(accountActions.setCurrent(nextKeyring.accounts[0]));
                  navigate('MainScreen');
                } else {
                  navigate('WelcomeScreen');
                }
              }}>
              &nbsp;{t('YesRemove')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RemoveWalletScreen() {
  const { t } = useTranslation();
  const currentAccount = useCurrentAccount();
  const address = useAccountAddress();
  const [isOpen, setIsOpen] = useState(false);
  const currentKeyring = useCurrentKeyring();
  return (
    <Layout className="h-full">
      <CHeader
        onBack={() => {
          window.history.go(-1);
        }}
        title={currentKeyring.alianName}
      />
      <Content style={{ backgroundColor: '#1C1919' }}>
        <div className="flex flex-col items-center mx-auto mt-36 gap-2_5 w-110">
          <div
            style={{
              width: '6rem',
              height: '6rem',
              borderRadius: '3rem',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: '#CC3333',
              justifyContent: 'center'
            }}>
            <FontAwesomeIcon icon={faTrashCan} style={{ height: '2.4rem' }} />
          </div>
          <span className="text-2xl text-soft-white">
            {shortAddress(address)}{' '}
            {currentAccount?.type == KEYRING_CLASS.PRIVATE_KEY ? (
              <span className="text-xs rounded bg-primary-active p-1.5">IMPORTED</span>
            ) : (
              <></>
            )}
          </span>
          <span className="text-lg text-center">
            {'Please pay attention to whether you have backed up the mnemonic/private key to prevent asset loss'}.
          </span>
          <span className="text-lg text-center text-error">{t('This action is not reversible')}.</span>
          <Button
            danger
            type="text"
            size="large"
            className="box w440 mt-3_75"
            onClick={() => {
              setIsOpen(true);
            }}>
            <div className="font-semibold text-center text-4_5">{t('Remove Wallet')}</div>
          </Button>
        </div>
      </Content>

      <AlertPanel
        visible={isOpen}
        onCancel={() => {
          setIsOpen(false);
        }}
      />
    </Layout>
  );
}
