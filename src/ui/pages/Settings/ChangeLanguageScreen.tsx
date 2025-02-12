import { Button, Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { useTranslation } from 'react-i18next';

import { LANGS } from '@/shared/constant';
import CHeader from '@/ui/components/CHeader';
import { useChangeLocaleCallback, useLocale } from '@/ui/state/settings/hooks';

export default function ChangeLanguageScreen() {
  const { t } = useTranslation();
  const locale = useLocale();
  const changeLocale = useChangeLocaleCallback();

  return (
    <Layout className="h-full">
      <CHeader
        onBack={() => {
          window.history.go(-1);
        }}
        title="Language"
      />
      <Content style={{ backgroundColor: '#1C1919' }}>
        <div className="flex flex-col items-center mx-auto mt-5 gap-3_75 justify-evenly w-95">
          {LANGS.map((item, index) => {
            return (
              <Button
                key={index}
                size="large"
                type="default"
                className="box w-115 default"
                onClick={() => {
                  changeLocale(item.value);
                }}>
                <div className="flex items-center justify-between text-lg font-semibold">
                  <div className="flex-grow text-left">{t(item.label)}</div>
                  {item.value == locale ? (
                    <span className="w-4 h-4">
                      <img src="./images/check.svg" alt="" />
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </Content>
    </Layout>
  );
}
