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
	 * - mode モード    0:テーブルセルモード, 1:区分モード
	 */
	constructor(tbl,param){
		
		// HTMLテーブルのjQueryオブジェクト
		if(!(tbl instanceof jQuery)) tbl = jQuery(tbl);
		this.tbl = tbl;
		
		
		this.saveKeys = ['mode']; // ローカルストレージへ保存と読込を行うparamのキー。
		this.ls_key = "TableTransform"; // ローカルストレージにparamを保存するときのキー。
		this.param = this._setParamIfEmpty(param);
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
		
		return param;
	}
	
	
	/**
	 * HTMLテーブルのフォーム変形
	 * @param mode モード(省略可）    0:テーブルセルモード, 1:区分モード
	 */
	transForm(mode){
		
		// 引数のモードが空であるなら、パラメーターの現在モードの逆をセットする。
		if(this._empty(mode)){
			if(this.param.mode == 1) mode = 0;
			if(this.param.mode == 0) mode = 1;
		}
		this.param.mode = mode;
		
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