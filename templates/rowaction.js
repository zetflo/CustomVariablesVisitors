/*!
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * This file registers the VisitorLog row action on the pages report.
 */

var CustomId = 0;

function DataTable_RowActions_Visitorlog(dataTable) {
	this.dataTable = dataTable;
}

DataTable_RowActions_Visitorlog.prototype = new DataTable_RowAction;

DataTable_RowActions_Visitorlog.isPageCustomVariable = function(module, action) {
	return module == 'CustomVariables' &&
		(action == 'getCustomVariables' || action == 'getCustomVariablesValuesFromNameId');
};


DataTable_RowActions_Visitorlog.prototype.onClick = function(actionA, tr, e) {
	
		
		// get Name
		var CustomName = tr.closest('tr[style="display: table-row;"]').prev().find('span.label').text();
	
		// get Value
		var CustomValue = tr.find('> td:first > span.label').text();
	
		// get CustomId
		var r = getVariableId(this.dataTable.param.idSite, CustomName);
		
		var segment = "";
		
		// @see http://piwik.org/docs/analytics-api/segmentation/#toc-list-of-segments
		if(CustomId != 0)	
			segment = "customVariableName"+CustomId+"=="+CustomName+";customVariableValue"+CustomId+"=="+CustomValue;
		
		var data = broadcast.getValuesFromUrl();
		
		var hash = getVisitorLogHashLink(this.dataTable.param.idSite, data.period, data.date, segment);
		
		
		actionA.attr({
			href: linkUrl = piwikHelper.getCurrentQueryStringWithParametersModified("idSite="+this.dataTable.param.idSite) + hash,
		});
	
	
	
	return true;
};

DataTable_RowActions_Registry.register({

	name: 'VisitorLog',

	dataTableIcon: 'plugins/CustomVariablesVisitors/templates/visitorlog_icon.png',
	dataTableIconHover: 'plugins/CustomVariablesVisitors/templates/visitorlog_icon_hover.png',
	
	order: 30,

	dataTableIconTooltip: [
		_pk_translate('CoreHome_VisitorlogRowActionTooltipTitle_js'),
		_pk_translate('CoreHome_VisitorlogRowActionTooltip_js')
	],

	createInstance: function(dataTable) {
		return new DataTable_RowActions_Visitorlog(dataTable);
	},

	isAvailableOnReport: function(dataTableParams) {
		return ( DataTable_RowActions_Visitorlog.isPageCustomVariable(dataTableParams.module, dataTableParams.action));
	},

	isAvailableOnRow: function(dataTableParams, tr) {
		if (tr.attr('id')) {
			// not available on groups (i.e. folders)
			return false;
		}
		
		return (DataTable_RowActions_Visitorlog.isPageCustomVariable(dataTableParams.module, dataTableParams.action));
	}

});

// helper


function getVariableId(idSite,name){
	// query ajax for get id variable
	var parameters = {};
    parameters.format = 'json';
    parameters.idSite = idSite;
    parameters.name = name;
    parameters.scope  = 'visit';

    
    parameters.module = 'API';
    parameters.method = 'CustomVariablesVisitors.getCustomVariableIdByName';

    var ajaxRequest = new ajaxHelper();
    ajaxRequest.addParams(parameters, 'get');
    ajaxRequest.setCallback(function(data){ 
    	setCustomId(data.value); 
    	});
    ajaxRequest.send(true);
	
    return true;
}

function setCustomId(value){
	CustomId = value;
}

function getVisitorLogHashLink(idSite, period, date, segment) {
	
	var url = '#module=Live&action=getVisitorLog&period=' + period + '&date=' + date + '&idSite=' + idSite;
	if (segment) {
		url += '&segment=' + segment;
	}
	return url;
}


