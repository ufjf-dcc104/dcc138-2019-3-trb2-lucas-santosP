function Sprite(params = {}) {
    var exemplo = {
        x: 64, y: 64,
        h: 25, w: 20,
        vx: 2.3, vy: 2.3,
        mc: 0, my: 0,
        assets: null,
        mapa: undefined,
        frame: 0,
        pontos: 0,
        direcao: '',
    }
    Object.assign(this, exemplo, params);
}
Sprite.prototype = new Sprite();
Sprite.prototype.constructor = Sprite;

Sprite.prototype.render = function (ctx, dt) {
    //Desenhando no chão
    if (this.mapa.cells[this.mc][this.ml].tipo == 0) {
        this.pontos++;
        this.mapa.cells[this.mc][this.ml].tipo = 2;
    }
    
    this.frame += 10 * dt;
    var F = Math.floor(this.frame);
    var imgX = (F % 8) * 20; var imgY;

    switch (this.direcao) {
        case 'direita':
            imgY = 26;
            break;
        case 'esquerda':
            imgY = 78;
            break;

        case 'cima':
            imgY = 52;
            break;

        case 'baixo':
            imgY = 0;
            break;

        default:
            imgX = -2;
            imgY = 0;
            break;
    }
    ctx.drawImage(
        this.assets.img("player"),
        imgX,
        imgY,
        20,
        26,
        this.x,
        this.y,
        this.w,
        this.h,
    );
};

Sprite.prototype.mover = function (movimento) {
    //Posição do sprite no map
    this.mc = Math.floor((this.x + (this.w / 2) - 2) / this.mapa.SIZE);
    this.ml = Math.floor((this.y + (this.h - 5)) / this.mapa.SIZE);
    //Direção da animação
    this.direcao = '';
    //Quando ambos botões são apertados
    if (movimento.esquerda && movimento.direita) {
        this.x += 0;
        this.direcao = '';
    }
    if (movimento.cima && movimento.baixo) {
        this.y += 0;
        this.direcao = '';
    }
    //ESQUERDA
    if (movimento.esquerda && !movimento.direita) {
        this.x -= this.vx;
        this.direcao = 'esquerda';
    }
    //DIREITA
    if (!movimento.esquerda && movimento.direita) {
        this.x += this.vx;
        this.direcao = 'direita';
    }
    //CIMA 
    if (movimento.cima && !movimento.baixo) {
        this.y -= this.vy;
        this.direcao = 'cima';
    }
    //BAIXO
    if (!movimento.cima && movimento.baixo) {
        this.y += this.vy;
        this.direcao = 'baixo';
    }
}

Sprite.prototype.colisaoMap = function (parede) {
    //Distancia dos objetivos apartir do centro deles
    var distanciaX = (this.x + this.w / 2) - (parede.x + parede.w / 2);
    var distanciaY = (this.y + 4 + this.h / 2) - (parede.y + parede.h / 2);
    //Soma das larguras e alturas dos objetos
    var somaLarguras = (this.w + parede.w) / 2;
    var somaAlturas = (this.h + parede.h - 10) / 2;

    if (Math.abs(distanciaX) < somaLarguras && Math.abs(distanciaY) < somaAlturas) {
        //sobreposição do pc na parede em X e Y
        var sobX = somaLarguras - Math.abs(distanciaX);
        var sobY = somaAlturas - Math.abs(distanciaY);

        if (sobX > sobY) {
            //Se a sobreposição ocorreu encima ou embaixo
            this.y = (distanciaY > 0) ? (this.y + sobY) : (this.y - sobY);
        }
        else {
            //Se a sobreposição ocorreu direita ou esquerda
            this.x = (distanciaX > 0) ? (this.x + sobX) : (this.x - sobX);
        }
    }
}