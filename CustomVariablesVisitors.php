<?php
class Piwik_CustomVariablesVisitors extends Piwik_Plugin{
	public function getInformation()
	{
		return array(
				'description' => Piwik_Translate('CustomVariablesVisitors_PluginDescription'),
				'author' => 'SearchandConnect',
				'author_homepage' => 'http://www.searchandconnect.com/',
				'version' => Piwik_Version::VERSION,
				'translationAvailable' => true,
		);
	}
	
	function getListHooksRegistered()
	{
		return array(
				'AssetManager.getJsFiles' => 'getJsFiles',
		);
	}
	
	public function getJsFiles($notification)
	{
		$jsFiles = &$notification->getNotificationObject();
		$jsFiles[] = 'plugins/CustomVariablesVisitors/templates/rowaction.js';
	}
	
}