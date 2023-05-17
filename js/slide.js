export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);

    // Objeto que vai guardar as informações das distancias do slide quando o mouse deslizar
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
  }

  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px,0,0)`;
  }

  // Função que vai ficar atualizando enquanto o mouse se move e vai armazenar o quanto o mouse se moveu do inicio ao fim do click e vai retornar a nova finalPosition que é de onde o slide tem que começar a se mover no próximo click
  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.5;
    return this.dist.finalPosition - this.dist.movement;
  }

  // Função que é iniciada quando um dos slides é clicado
  onStart(event) {
    let moveType;
    if (event.type === "mousedown") {
      event.preventDefault();
      // Na hora do click, clientX é armazenado para guardar o ponto de partida do mouse
      this.dist.startX = event.clientX;
      moveType = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      moveType = "touchmove";
    }

    // Durante o click, o evento que estiver em movetype é acionado
    this.wrapper.addEventListener(moveType, this.onMove);
    this.transition(false)
  }

  // Função que é iniciada quando segura o click do mouse em cima do slide
  onMove(event) {
    const pointerPosition =
      event.type == "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    // Enquanto houver movimento do mouse, a função updatePosition ficará sendo invocada sem parar
    const finalPosition = this.updatePosition(pointerPosition);
    // Chamando a função que irá fazer a movimentação do slide
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const moveType = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(moveType, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true)
    this.changeSlideOnEnd();

  }

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
      console.log(this.dist.movement);
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  // Slides config

  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return {
        position,
        element,
      };
    });
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  }
  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  init() {
    this.bindEvents();
    this.transition(true)
    this.addSlideEvents();
    this.slidesConfig();

    return this;
  }
}
