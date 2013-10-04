<?php

namespace Dukt\Seo\Google;

use Dukt\Seo\Common\AbstractAccount;

class Account extends AbstractAccount
{

    public function instantiate($response)
    {
        $this->email = $response['email'];
    }
}
