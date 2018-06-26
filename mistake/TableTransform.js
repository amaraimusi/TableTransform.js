/**
 * HTMLテーブル変形
 * 
 * @date 2018-6-23
 * @version 1.0.0
 * 
 */
class TableTransform{
	
	
	
	/**
	 * コンストラクタ
	 * 
	 * @param tbl HTMLテーブルのセレクタ、もしくはjQueryオブジェクト
	 * @param param 省略可
	 * - mode         モード    0:テーブルセルモード, 1:区分モード
	 * - dic_display  区分列モード・display値
	 * - dicCshList   区分モード・列表示配列
	 * - tdCssProps   TD要素のCSSプロパティリスト
	 * - dicCss       区分モード・TDのスタイル：
	 */
	constructor(tbl,param){
		
		// HTMLテーブルのjQueryオブジェクト
		if(!(tbl instanceof jQuery)) tbl = jQuery(tbl);
		this.tbl = tbl;
		
		this.saveKeys = ['mode']; // ローカルストレージへ保存と読込を行うparamのキー。
		this.ls_key = "TableTransform"; // ローカルストレージにparamを保存するときのキー。
		var param = this._setParamIfEmpty(param);
		this.param = param;
		
		// 列情報を取得する
		var clmData = this._getClmData(tbl);
		
		// TD要素のCSSプロパティリスト
		var tdCssProps = this._getTdCssProps(param);
		
		// テーブルセル列情報を取得する
		var tccData = this._getTblCellClmData(tbl,clmData,tdCssProps);
		
		// 区分列情報を取得する
		var dicData = this._getDivClmData(param,tccData);
		
		this.clmData = clmData;
		this.tdCssProps = tdCssProps;
		this.param['tccData'] = tccData;
		this.param['dicData'] = dicData;
	}

	
	/**
	 * If Param property is empty, set a value.
	 */
	_setParamIfEmpty(param){
		
		if(param == null){
			param = {};
		}
	
		// ローカルストレージで保存していたパラメータをセットする
		var param_json = localStorage.getItem(self.ls_key);
		if(!this._empty(param_json)){
			var lsParam = JSON.parse(param_json);
			if(lsParam){
				for(var i in self.saveKeys){
					var s_key = self.saveKeys[i];
					param[s_key] = lsParam[s_key];
				}
			}
		}
		
		if(param['mode'] == null)　param['mode'] = 0;
		if(param['dic_display'] == null)　param['dic_display'] = 'block';
		
		return param;
	}
	
	
	/**
	 * HTMLテーブルのフォーム変形
	 * @param mode モード(省略可）    0:テーブルセルモード, 1:区分モード
	 */
	transForm(mode){
		
		// 行数を取得する
		var trs = this.tbl.find('tbody tr');
		var row_count = trs.length;
		
		trs.css('display','block');
		this.tbl.find('thead').hide();
		
		// 行数が空なら処理中断
		if(row_count == 0) return;
		
		// 引数のモードが空であるなら、パラメーターの現在モードの逆をセットする。
		if(this._empty(mode)){
			if(this.param.mode == 1) mode = 0;
			if(this.param.mode == 0) mode = 1;
		}
		this.param.mode = mode;
		
		// 列情報を取得する
		var clmData;
		if(mode == 1){
			clmData = this.param.dicData;
			console.log('test=B');//■■■□□□■■■□□□■■■□□□)
			console.log(clmData);//■■■□□□■■■□□□■■■□□□)
		}else{
			clmData = this.param.tccData;
		}
		
		
		
		trs.each((i,tr)=>{

			var tr = jQuery(tr);
			var tds = tr.find('td');
			tds.each((c_i,td) => {
				var td = jQuery(td);
				var clmEnt = clmData[c_i]; 
				td.css(clmEnt.css);
				
				if(clmEnt.csh_flg == 1){
					td.show();
				}else{
					console.log('hide');//■■■□□□■■■□□□■■■□□□)
					td.hide();
				}
			});
		});
		
	}
	
	
	
	/**
	 * 列情報を取得する
	 * @param jQuery tbl テーブル要素
	 * @return 列情報
	 */
	_getClmData(tbl){
		var clmData = []; // 列情報
		var ths = tbl.find('thead th');
		ths.each((c_i,th)=>{
			th = jQuery(th);
			var clm_name = th.text();
			clmData.push(clm_name);
		});

		return clmData;
	}
	
	
	/**
	 * TD要素のCSSプロパティリストを取得する
	 * @return array TD要素のCSSプロパティリスト
	 */
	_getTdCssProps(param){
		
		if(param['TdCssProps']) return param['TdCssProps'];

		var tdCssProps = [
			'display',
			'color',
			'background-color',
			'margin',
			'margin-top',
			'margin-right',
			'margin-bottom',
			'margin-left',
			'padding',
			'padding-top',
			'padding-right',
			'padding-bottom',
			'padding-left',
			'font-size',
			'border',
		];
		
		return tdCssProps;
	}
	
	
	/**
	 * テーブルセル列情報を取得する
	 * @param jQuery       tbl           テーブル要素
	 * @param array        clmData       列情報
	 * @parma array        tdCssProps    TDのCSSプロパティリスト
	 * @return array テーブルセル列情報
	 */
	_getTblCellClmData(tbl,clmData,tdCssProps){
		
		var tccData = []; // テーブルセル列情報
		var tr1 = tbl.find('tbody tr:first-child');

		if(tr1[0]){

			var tds = tr1.find('td');
			tds.each((i,td)=>{

				var td = jQuery(td);
				var css = td.css(tdCssProps); // TD要素のCSS情報を取得

				var csh_flg = 1; // 表示フラグ
				if(!css['display'] || css['display'] == 'none'){
					csh_flg = 0;
				}
				
				var clm_name = clmData[i]; // 列名
				var ent = {
					'clm_name':clm_name,
					'css':css,
					'csh_flg':csh_flg,
				};
				tccData.push(ent);
				
			});
			
		}else{

			// ベース・テーブルセルCSS
			var bTccCss = this._getBaseTccCss();
			
			for(var i in clmData){
				var clm_name = clmData[i];
				var ent = {
					'clm_name':clm_name,
					'css':bTccCss,
					'csh_flg':1,
				};
				tccData.push(ent);
			}
			
		}
		
		return tccData;
		
	}
	
	
	/**
	 * 区分列情報を取得する
	 * @param param
	 * @param array tccData テーブルセル列情報
	 * @return 区分列情報
	 */
	_getDivClmData(param,tccData){
		console.log('_getDivClmData');//■■■□□□■■■□□□■■■□□□)
		
		// テーブルセル列情報を複製して区分列情報を作成する。
		var dicData = jQuery.extend(true, {}, tccData);
		
		// 列情報に列表示配列をセットする
		if(param['dicCshList']){
			dicData = this._setCshToClmData(dicData,param.dicCshList);
		}
		//
		
		for(var i in dicData){
			var ent = dicData[i];
			ent.css.display = this.param.dic_display;
			ent.css['width'] = 'auto';
			ent.css['height'] = 'auto';
		}
		
		console.log(dicData);//■■■□□□■■■□□□■■■□□□)

		return dicData;
		
	}
	
	
	/**
	 * 列情報に列表示配列をセットする
	 * @param clmData 列情報
	 * @param cshList 列表示配列
	 * @return 列表示配列を反映した列情報
	 */
	_setCshToClmData(clmData,cshList){

		for(var i in clmData){
			var ent = clmData[i];
			var csh_flg = 0;
			if(cshList[i] != null) csh_flg = cshList[i];
			ent.csh_flg = csh_flg;
			
			// ■■■□□□■■■□□□■■■□□□
//			if(csh_flg == 1){
//				ent.css.display = this.param.dic_display;
//			}else{
//				ent.css.display = 'none';
//			}
		}
		
		return clmData;
	}
	
	/**
	 * ベース・テーブルセルCSSを取得する
	 * 
	 * @note
	 * テーブルセルモードにおけるTD要素のCSS情報を取得する。
	 */
	_getBaseTccCss(){
		return {
			'background-color':'rgba(0,0,0,0)',
			'border':'1px inset rgb(128,128,128)',
			'color':'rgb(51,56,57)',
			'display':'table-cell',
			'font-size':'16px',
			'margin':'0px',
			'margin-bottom':'0px',
			'margin-left':'0px',
			'margin-right':'0px',
			'margin-top':'0px',
			'padding':'0px',
			'padding-bottom':'0px',
			'padding-left':'0px',
			'padding-right':'0px',
			'padding-top':'0px'
		};
		
	}
	

	/**
	 * ローカルストレージにパラメータを保存する
	 */
	saveParam(){
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
	clear(){
		localStorage.removeItem(self.ls_key);
	}




	// Check empty.
	_empty(v){
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
	
	
}