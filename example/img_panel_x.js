/**
 * 画像をウィンドウで表示する
 * 
 * @note
 * PanelX.jsに依存
 * 
 * @version 4.0.1
 * @date 2017-4-14
 */

var img_panel_x;
$(function(){

	var max_w = window.innerWidth * 0.9;
	var css={
			'width':max_w + 'px',
			'max-width':max_w + 'px',
		};
	
	// パネルXの生成と初期化
	img_panel_x = new PanelX({
		'panel_id':'img_panel_x',
		'contents':"<img id='img_ipx' src='' class='img-responsive' />",
		'panel_css':css,
		'base_width':max_w,
		});
	
	//var panel = img_panel_x.panel;
	var panelBody = img_panel_x.getPanelBody();
	panelBody.css('padding','0px');

	$('.img_panel_x').each(function(){
		
		$(this).click(function() {

			var imgElm = $(this);
			
			var src = imgElm.attr('src');
			
			//空なら処理抜け
			if(_empty(src)){
				return;
			}
			
			// 原寸画像ファイルパスを再構築
			var ary = src.split('/');
			var flg=false;
			var ary2 = [];
			for(var i = ary.length-1 ; i>=0 ; i--){
				var part = ary[i];
				
				if(flg==false && part == 'thum'){
					flg=true;
				}else{
					ary2.push(part);
				}
			}
			ary2.reverse();
			var origFp = ary2.join('/');

			
			$('#img_ipx').attr('src',origFp); // 画像要素へ原寸画像ファイルをセット
			img_panel_x.showPanel(imgElm);// パネルを表示
			img_panel_x.autofit();// オートフィット

		});
	});
	
	
});



// 空判定
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