<?php

namespace Craft;

require(CRAFT_PLUGINS_PATH.'seo/vendor/autoload.php');

class Seo_SettingsController extends BaseController
{
    public function actionSaveService()
    {
        $step1 = craft()->request->getPost('step1');
        $step2 = craft()->request->getPost('step2');

        if($step1)
        {
            $this->step1();
        }

        if($step2)
        {
            $this->step2();
        }
    }

    public function step1()
    {
        $model = new Seo_ServiceModel();

        $attributes = craft()->request->getPost('service');

        $model->setAttributes($attributes);

        if (craft()->seo->saveService($model)) {

            craft()->userSession->setNotice(Craft::t('Service saved.'));

            $this->redirect('seo');
        } else {

            craft()->userSession->setError(Craft::t("Couldn't saave service."));

            craft()->urlManager->setRouteVariables(array('service' => $model));
        }
    }

    public function step2()
    {
        $providerClass = "Google";
        $attributes = craft()->request->getPost('service');

        $service = Seo_ServiceRecord::model()->find('providerClass=:providerClass', array(':providerClass' => $providerClass));

        foreach($attributes as $k => $v)
        {
            $service->{$k} = $v;
        }

        $service->save();

        craft()->userSession->setNotice(Craft::t('Service saved.'));

        $this->redirect('seo/settings');
    }

    public function actionDeleteService()
    {
        $id = craft()->request->getRequiredParam('id');

        craft()->seo->deleteServiceById($id);

        craft()->userSession->setNotice(Craft::t('Service deleted.'));

        $this->redirect('seo');
    }

    public function actionResetServiceToken()
    {
        $serviceId = craft()->request->getRequiredParam('id');

        craft()->seo->resetServiceToken($serviceId);

        craft()->userSession->setNotice(Craft::t('Token Reset.'));

        $redirect = UrlHelper::getUrl('seo/settings');

        $this->redirect($redirect);

    }

    public function actionServiceCallback()
    {
        craft()->seo->connectService();
    }
}