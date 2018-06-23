/**
 * パネルX
 * 
 * @note
 * トリガーボタンの直下に表示するパネルを作成する。
 * パネルはドラッグによる移動とリサイズが可能である。
 * パネルは内部で自動生成される。
 * 後日対応→既存のHTML要素をパネルとする機能。
 * 
 * @version 1.0.1
 * @date 2017-4-8 | 2017-4-17
 * @param param 
 * - panel_id パネル要素のID属性名を指定する
 * - title パネルのタイトル
 * - contents パネルのコンテンツ
 * - parent_panel_slt パネルの親要素（省略時は.container要素。それもなければbody要素)
 * - panel_body_slt パネルボディ要素のセレクタ
 * - base_width 基本横幅(デフォ640px)
 */
var PanelX =function(param){
	
	
	this.param = param;
	
	this.saveKeys = []; // ローカルストレージへ保存と読込を行うparamのキー。
	
	this.ls_key = "PanelX_v6"; // ローカルストレージにparamを保存するときのキー。
	
	this.panel; // パネル要素
	
	var self=this; // Instance of myself.
	
	

	/**
	 * initialized.
	 */
	this.constract=function(){
		
		// If Param property is empty, set a value.
		var param = _setParamIfEmpty(this.param);
		
		
		// パネルの基本構造
		var panel_html = 
			"<div id='%0'>" +
			"	<div id='%0_head'>" +
			"		<div id='%0_head1'>%2</div>" +
			"		<div id='%0_head2'>" +
			"			<button id='%0_close' type=\"button\" class=\"btn btn-primary btn-xs\">" +
			"				<span class=\"glyphicon glyphicon-remove\"></span>" +
			"			</button>" +
			"		</div>" +
			"	</div>" +
			"	<div id='%0_body' style='padding:4px' >" +
			"		%1" +
			"	</div>" +
			"</div>" +
			"";
		
		// パネルにパネルIDとコンテンツを埋め込む
		panel_html = panel_html.replace(/%0/g,param.panel_id);
		panel_html = panel_html.replace('%1',param.contents);
		panel_html = panel_html.replace('%2',param.title);
		
		
		// パネルの親要素を取得し、パネルのHTMLコードを追加
		var parElm = _getParentElm(param.parent_panel_slt);
		parElm.append(panel_html);
		
		
		// パネルセレクタとパネルオブジェクトを取得
		var panel_slt = param.panel_slt;
		var panelElm = $(panel_slt);
		


		// パネルにCSSを適用する
		panelElm.css(param.panel_css);
		

		
		
		// パネルのヘッダーにCSSスタイルを適用する
		$(panel_slt + '_head').css({
			'width':'100%',
			'background-color':'#4088ca',
		});
		$(panel_slt + '_head1').css({
			'float':'left',
			'width':'80%',
			'color':'white',
			'display':'inline-block;',
		});
		$(panel_slt + '_head2').css({
			'width':'15%',
			'margin-left':'auto',
			'text-align':'right',
			'display':'inline-block;',
		});
		
		

//		//領域外クリックでツールチップを閉じるが、ツールチップ自体は領域内と判定させ閉じないようにする。
//		panelElm.click(function(e) {
//			e.stopPropagation();
//		});
//		
//		//パネルの外をクリックするとツールチップを閉じる
//		$(document).click(function (){
//			panelElm.hide();
//		});
		
		
			
		// 閉じるボタンクリックボタンイベント
		$(panel_slt + '_close').click(function(e){
			panelElm.hide();
		});
		
		// パネルを移動およびリサイズできるようにする
		_initMoveAndResize(panelElm,param.panel_body_slt);
		
		this.param = param;
		this.panel = panelElm;
		
	}
	
	/**
	 * パネルを表示する
	 * @param trg トリガー要素。ボタン要素など。
	 */
	this.showPanel =function(trg){

		
		// jQueryオブジェクトでない場合は、jQueryオブジェクトに変換する
		if(!(trg instanceof jQuery)){
			trg = $(trg);
		}

		
		//　トリガー要素の位置からパネルの位置を算出する。
		var offset = trg.offset();
		var h = trg.outerHeight();
		var w = trg.outerWidth();
		var top = offset.top + h;
		var left = offset.left;
		
		var wnd_w = window.innerWidth;
		var b_w = self.param.base_width;
		if((wnd_w - left) < b_w){
			left = wnd_w - b_w;
		}
		
		// パネルを表示してから位置をセットする（※表示してから位置セットしないとバグが起こる）
		self.panel.show();	
		self.panel.offset({'top':top,'left':left });

	}
	
	
	
	/**
	 * オートフィット
	 * 
	 * @note
	 * 内容の幅にパネルのサイズを合わせる。
	 * 
	 */
	this.autofit = function(){
		self.panel.css({
			'width':'auto',
			'height':'auto',
			'display':'inline-block',
		});
	}
	
	
	/**
	 * パネルボディ要素を取得する
	 */
	this.getPanelBody = function(){
		return self.panel.find(self.param.panel_body_slt);
		
	}
	
	
	
	
	
	// If Param property is empty, set a value.
	function _setParamIfEmpty(param){
		
		if(param == undefined){
			param = {};
		}
	
		// ローカルストレージで保存していたパラメータをセットする
		var param_json = localStorage.getItem(self.ls_key);
		if(!_empty(param_json)){
			var lsParam = JSON.parse(param_json);
			if(lsParam){
				for(var i in self.saveKeys){
					var s_key = self.saveKeys[i];
					param[s_key] = lsParam[s_key];
				}
			}
		}
		
		
		
		if(param['panel_id'] == undefined){
			param['panel_id'] = 'panel_x';
		}
		
		param['panel_slt'] = '#' + param['panel_id'];
		
		if(param['title'] == undefined){
			param['title'] = 'パネルX';
		}
		
		if(param['contents'] == undefined){
			param['contents'] = '';
		}
		
		if(param['parent_panel_slt'] == undefined){
			param['parent_panel_slt'] = '';
		}
		
		if(param['base_width'] == undefined){
			param['base_width'] = 640;
		}
		
		
		if(param['panel_css'] == undefined){
			param['panel_css'] = _getDefaultCss();
		}else{
			// デフォルトCSSへ引数のCSSをマージする
			var def_css = _getDefaultCss();
			def_css['width'] = param['base_width'];
			var panel_css = param['panel_css'];
			param['panel_css'] = $.extend(def_css,panel_css);
		}
		
		if(param['panel_body_slt'] == undefined){
			param['panel_body_slt'] = param['panel_slt'] + '_body';
		}
		
		
		
		
		
		
		
		
		
		return param;
	}
	
	/**
	 * デフォルトのパネルCSS情報を取得する
	 * @returns パネルCSS情報
	 */
	function _getDefaultCss(){
		
		var def_css = {
				'position':'absolute',
				'width':'150px',
				'height':'100px',
				'border':'solid 4px #4088ca',
				'border-radius':'10px',
				'z-index':'1',
				'display':'none',
			};
		return def_css;
	}
	
	
	
	/**
	 * パネルの親要素を取得し、パネルのHTMLコードを追加
	 * @param par_slt パネル親要素セレクタ
	 * @returns パネルの親要素
	 */
	function _getParentElm(par_slt){
		var parElm = null;
		
		// パネル親要素セレクタが空であるなら、containerかbodyを親要素として取得
		if(_empty(par_slt)){
			parElm = _getParentElmFromContainer();
		}
		

		// パネル親要素セレクタが空でないならパネル親要素を取得する。
		else{
			parElm = $(par_slt);
			
			// 取得できなかったらcontainerかbodyを親要素として取得する。
			if(!parElm[0]){
				parElm = _getParentElmFromContainer();
			}
		}

		
		return parElm;
	}
	
	/**
	 * containerかbodyを親要素として取得する
	 * @returns パネルの親要素
	 */
	function _getParentElmFromContainer(){
		var parElm = $('.container').eq(0);
		if(!parElm[0]){
			var parElm = $('body');
		}
		return parElm;
	}
	
	
	
	/**
	 * パネルを移動およびリサイズできるようにする
	 * @param panel パネル要素
	 * @param body_slt パネルボディ要素セレクタ
	 */
	function _initMoveAndResize(panel,body_slt){
		
		
		//～読込イベント処理～
		//ドラッグ移動を組み込み、チャット画面を動かせるようにする。
		var draggableDiv = panel.draggable();
		
		//ドラッグ移動を組み込むとテキスト選択ができなくなるので、パネルボディ部分をテキスト選択可能にする。
		var bodyElm = panel.find(body_slt);
		$(bodyElm,draggableDiv).mousedown(function(ev) {
				draggableDiv.draggable('disable');
			}).mouseup(function(ev) {
				draggableDiv.draggable('enable');
			});
		
		panel.resizable({
			maxHeight:700,
			maxWidth:700,
			minHeight:40,
			minWidth:100,
			stop: function( event, ui ) {
				//リサイズ操作から手を放した瞬間のイベント
				// -- 後日実装予定 --

			}
		});
	}


	/**
	 * ローカルストレージにパラメータを保存する
	 */
	this.saveParam = function(){
		var lsParam = {};
		for(var i in self.saveKeys){
			var s_key = self.saveKeys[i];
			lsParam[s_key] = self.param[s_key];
		}
		var param_json = JSON.stringify(lsParam);
		localStorage.setItem(self.ls_key,param_json);
	}
	
	
	/**
	 * ローカルストレージで保存しているパラメータをクリアする
	 */
	this.clear = function(){
		localStorage.removeItem(self.ls_key);
	}
	
	
	/**
	 * Get value by the field.
	 * 
	 * @note
	 * Find the element that matches the field from the parent element and get its value.
	 * The field is class attribute or name attribute.
	 * 
	 * @param parElm : parent element.
	 * @param field 
	 * @returns
	 */
	function _getValueByField(parElm,field){
		var v = undefined;
		var elm = _findInParentEx(parElm,field);
		if(elm[0]){
			v = _getValueEx(elm);
		}
		return v;
	}
	
	
	/**
	 * Get value from elements regardless of tag type.
	 * @param elm : Value element.
	 * @returns Value from value element.
	 */
	function _getValueEx(elm){
		
		var v = undefined;
		var tagName = elm.prop("tagName"); 
		
		if(tagName == 'INPUT' || tagName == 'SELECT' || tagName=='TEXTAREA'){
			
			var typ = elm.attr('type');

			if(typ=='checkbox'){
				
				v = 0;
				if(elm.prop('checked')){
					v = 1;
				}
				
			}
			
			else if(typ=='radio'){
				var opElm = form.find("[name='" + f + "']:checked");
				v = 0;
				if(opElm[0]){
					v = opElm.val();
				}
	
			}
			
			else{
				v = elm.val();

			}
			
		}else{
			v = elm.html();
		}
		return v;
	}
	
	
	
	/**
	 * Search for matched elements from the parent element regardless of class attribute, name attribute, id attribute.
	 * @param parElm : parent element.
	 * @param field : class, or name attribute
	 * @returns element.
	 */
	function _findInParentEx(parElm,field){
		var elm = parElm.find('.' + field);
		if(!elm[0]){
			elm = parElm.find("[name='" + field + "']");
		}else if(!elm[0]){
			elm = parElm.find('#' + field);
		}
		return elm;
	}
	
	
	// Check empty.
	function _empty(v){
		if(v == null || v == '' || v=='0'){
			return true;
		}else{
			if(typeof v == 'object'){
				if(Object.keys(v).length == 0){
					return true;
				}
			}
			return false;
		}
	}
	
	

	// call constractor method.
	this.constract();
}