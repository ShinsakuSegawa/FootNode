
var dtcom = {}; // namespace

/* アイテム
 * {int} x アイテムの中心x座標
 * {int} y アイテムの中心y座標
 * {string} type アイテムの図形タイプ
 */
dtcom.item = function(x, y, type) {
  this.x = x; 
  this.y = y;
  this.type = type;
};

/* Canvasクラス
 * {canvas context} ctx 処理対象となるcontext
 * {int} w 表示領域の幅
 * {int} h 表示領域の高さ
 * {objext} names 呼び出し元のnamespace
 */
dtcom.canv = function(ctx, w, h, names) {
  this.ctx = ctx; // 処理対象context
  this.area = {w:w, h:h};  // 表示エリア
  this.cvpos = {x:0, y:0};  // ブラウザ上のCanvas左上座標
  this.grSep = 30;  // グリッド間隔(px)
  this.grSephf = this.grSep / 2;  // グリッド間隔の半分
  this.grWidth = 1; // グリッド線の太さ
  this.grXAr = []; // グリッドのX座標を格納した配列
  this.grRcv = false; // canvasの右端がグリッドと重なるならtrue
  this.grYAr = []; // グリッドのY座標を格納した配列
  this.grBcv = false; // canvasの下端がグリッドと重なるならtrue
  this.itemAr = []; // アイテム格納配列

  /* ブラウザ上のCanvas左上座標を求める */
  var $cvdiv = $('#' + names.con.id.cvdiv);
  this.cvpos.x = $cvdiv.offset().left;
  this.cvpos.y = $cvdiv.offset().top;

  /* グリッド座標計算 */
  var gcntx = 0;  // 縦線本数
  if (this.area.w % this.grSep) {
    gcntx = Math.floor(this.area.w / this.grSep);
  } else {
    // canvasの右端がグリッドと重なる場合
    gcntx = this.area.w / this.grSep - 1;
    this.grRcv = true;
  }
  for (var i = 0; i < gcntx; i++) {
    this.grXAr[i] = this.grSep * (i + 1);
  }
  
  var gcnty = 0;  // 横線本数
  if (this.area.h % this.grSep) {
    gcnty = Math.floor(this.area.h / this.grSep);
  } else {
    // canvasの下端がグリッドと重なる場合
    gcnty = this.area.h / this.grSep - 1;
    this.grBcv = true;
  }
  for (var i = 0; i < gcnty; i++) {
    this.grYAr[i] = this.grSep * (i + 1);
  }

  /* 初期処理
   * return なし
   */
  this.init = function() {
    // アイテム初期配置
    this.itemAr = [];
    this.itemAr[0] = new dtcom.item(this.grSephf, this.grSephf, names.con.dtype.cir);
    this.itemAr[1] = new dtcom.item(this.grSephf, this.grSep + this.grSephf, names.con.dtype.tri);
    this.itemAr[2] = new dtcom.item(this.grSephf, this.grSep * 2 + this.grSephf, names.con.dtype.squ);
  }

  /* 画面を初期化
   * return なし
   */
  this.blank = function() {
    // 画面をクリア
    this.ctx.clearRect(0, 0, this.area.w, this.area.h);
    // グリッド表示
    this.ctx.save();
    this.ctx.globalAlpha = 0.5;
    this.ctx.strokeStyle = "#000033";
    this.ctx.lineWidth = this.grWidth;
    for (var i = 0; i < this.grXAr.length; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.grXAr[i], 0);
      this.ctx.lineTo(this.grXAr[i], this.area.h);
      this.ctx.stroke();
    }
    for (var i = 0; i < this.grYAr.length; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0,this.grYAr[i]);
      this.ctx.lineTo(this.area.w, this.grYAr[i]);
      this.ctx.stroke();
    }
    this.ctx.restore();
  };

  /* 画面表示
   * return なし
   */
  this.draw = function() {
    // 画面を初期化
    this.blank();
    // アイテム配置
    for (var i = 0; i < this.itemAr.length; i++) {
      switch (this.itemAr[i].type) {
        case names.con.dtype.cir: {
          this.drawCir(this.itemAr[i].x, this.itemAr[i].y);
          break;
        }
        case names.con.dtype.tri: {
          this.drawTri(this.itemAr[i].x, this.itemAr[i].y);
          break;
        }
        case names.con.dtype.squ: {
          this.drawSqu(this.itemAr[i].x, this.itemAr[i].y);
          break;
        }
        default: {
          this.drawCir(this.itemAr[i].x, this.itemAr[i].y);
          break;
        }
      }
    }
  };

  /* 毎回計算しないように外に記述 */
  this.linelng = this.grSep / 2 - 1;  // よく使う長さ
  this.PI2 = Math.PI * 2; // 2π
  // 正三角形の高さ÷2
  this.trhghthf = this.linelng * Math.tan(Math.PI / 3) / 2;
  
  /* 直径 this.grSep - 2 の円を描く
   * {int} x 中心のx座標
   * {int} y 中心のy座標
   * return なし
   */
  this.drawCir = function(x,y) {
    this.ctx.save();
    this.ctx.fillStyle = 'green';
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.linelng, 0, this.PI2, false);
    this.ctx.fill();
    this.ctx.restore();
  };

  /* 辺の長さ this.grSep - 2 の正三角形を描く
   * {int} x 中心のx座標
   * {int} y 中心のy座標
   * return なし
   */
  this.drawTri = function(x,y) {
    this.ctx.save();
    this.ctx.fillStyle = 'blue';
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - this.trhghthf);
    this.ctx.lineTo(x - this.linelng, y + this.trhghthf);
    this.ctx.lineTo(x + this.linelng, y + this.trhghthf);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  };
  
  /* 辺の長さ this.grSep - 2 の正方形を描く
   * {int} x 中心のx座標
   * {int} y 中心のy座標
   * return なし
   */
  this.drawSqu = function(x,y) {
    this.ctx.save();
    this.ctx.fillStyle = 'purple';
    this.ctx.beginPath();
    this.ctx.moveTo(x - this.linelng, y - this.linelng);
    this.ctx.lineTo(x - this.linelng, y + this.linelng);
    this.ctx.lineTo(x + this.linelng, y + this.linelng);
    this.ctx.lineTo(x + this.linelng, y - this.linelng);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  };

  /* アイテムが指定した座標内にあるか判定
   * {int} x x座標
   * {int} y y座標
   * return アイテムがあればthis.itemArのindex アイテムが無ければnull
   */
  this.checkItem = function(x, y) {
    var rtn = null;
    for (var i = 0; i < this.itemAr.length; i++) {
      if (x >= this.itemAr[i].x - this.grSephf &&
          x <= this.itemAr[i].x + this.grSephf) {
        if (y >= this.itemAr[i].y - this.grSephf &&
            y <= this.itemAr[i].y + this.grSephf) {
          rtn = i;
          break;
        }
      }
    }
    return rtn;
  };

