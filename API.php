<?php
/**
 * Piwik - Open source web analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 * @version $Id: API.php 7713 2013-01-02 08:34:35Z matt $
 *
 * @category Piwik_Plugins
 * @package Piwik_CustomVariablesVisitors
 */

class Piwik_CustomVariablesVisitors_API
{
	private static $instance = null;
	
	/**
	 * Get Singleton instance
	 * @return Piwik_CustomVariablesVisitors_API
	 */
	public static function getInstance()
	{
		if (self::$instance == null)
		{
			self::$instance = new self;
		}
		return self::$instance;
	}
	
	/**
	 * Returns Id  for a given website, or list of websites and customVariable, and a scope
	 *
	 * @param string|array $idSite Array or Comma separated list of website IDs to request the goals for
	 * @param string @name The name of custom variable
	 * @param string @scope The scope of variable value are 'visit' or 'page', default is 'visit'
	 * @return integer ID of the last custom variable use
	 */
	public function getCustomVariableIdByName( $idSite, $name, $scope='visit' )
	{
		$id = false;
		
		//TODO calls to this function could be cached as static
		// would help UI at least, since some UI requests would call this 2-3 times..
		$idSite = Piwik_Site::getIdSitesFromIdSitesString($idSite);
		if(empty($idSite))
		{
			return array();
		}
		Piwik::checkUserHasViewAccess($idSite);
		$paramsBind = array_merge(array(implode(", ", $idSite)),array_fill (0 , 5, $name ));
		
		//var_dump($paramsBind);
		
		$table=($scope=='visit')?'log_visit':'log_link_visit_action';
		
		$query      = sprintf('SELECT DISTINCT  `custom_var_k1` ,  `custom_var_k2` ,  `custom_var_k3` ,  `custom_var_k4` ,  `custom_var_k5` 
				FROM %s WHERE idsite IN (?) 
				AND (
					`custom_var_k1` =  ?
					OR  `custom_var_k2` =  ?
					OR  `custom_var_k3` =  ?
					OR  `custom_var_k4` =  ?
					OR  `custom_var_k5` =  ?
				) ORDER BY idvisit DESC LIMIT 1',
			Piwik_Common::prefixTable($table));
		
		$return     = Piwik_FetchRow($query, $paramsBind);
		
		if($return)
			foreach($return as $key => $field){
				if($field == $name){
					$id = str_replace('custom_var_k','',$key);
					break;
				}
			}

		return $id;
	}
	
}