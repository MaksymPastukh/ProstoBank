'use strict';

///////////////////////////////////////
// Modal window

const modalWindow = document.querySelector('.modal-window'),
  overlay = document.querySelector('.overlay'),
  btnCloseModalWindow = document.querySelector('.btn--close-modal-window'),
  btnsOpenModalWindow = document.querySelectorAll('.btn--show-modal-window'),
  scrollBtnTo = document.querySelector('.btn--scroll-to'),
  scrollToSection1 = document.querySelector('#section--1'),
  tabs = document.querySelectorAll('.operations__tab'),
  tabContainer = document.querySelector('.operations__tab-container'),
  tabContents = document.querySelectorAll('.operations__content'),
  nav = document.querySelector('.nav'),
  header = document.querySelector('header'),
  allSection = document.querySelectorAll('.section'),
  lazyImages = document.querySelectorAll('img[data-src]'),
  // Slider
  slides = document.querySelectorAll('.slide'),
  btnLeft = document.querySelector('.slider__btn--left'),
  btnRight = document.querySelector('.slider__btn--right'),
  dotContainer = document.querySelector('.dots');
const openModalWindow = function(e) {
  e.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function() {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(button => {
  button.addEventListener('click', openModalWindow);
});

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});

///// Плавный скрол с кнопки узнать больше

scrollBtnTo.addEventListener('click', () => {
  scrollToSection1.scrollIntoView({ behavior: 'smooth' });
});

///// Плавный скрол с панели навигации, делегирование событийж

document.querySelector('.nav__links').addEventListener('click', function(e) {
    e.preventDefault();
    console.log(e.target);

    if (e.target.classList.contains('nav__link')) {
      const href = e.target.getAttribute('href');
      console.log(href);
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth'
      });
    }
  }
);

///// Табы

tabContainer.addEventListener('click', function(e) {
  const clickBtn = e.target.closest('.operations__tab');

  // Пункт охраны
  if (!clickBtn) return;

  // Активная ыкладка

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickBtn.classList.add('operations__tab--active');

// Активный контент

  tabContents.forEach(content => content.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clickBtn.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////// Анимация потускнения на панели навигации

const navLinksHoverAnimation = function(e) {
  if (e.target.classList.contains('nav__link')) {
    const linkOver = e.target;
    const sibLingLinks = linkOver.closest('.nav__links').querySelectorAll('.nav__link');
    const logo = linkOver.closest('.nav').querySelector('img');
    const logoText = linkOver.closest('.nav').querySelector('.nav__text');

    sibLingLinks.forEach(item => {
      if (item !== linkOver) item.style.opacity = this;
    });

    logo.style.opacity = this;
    logoText.style.opacity = this;
  }
};

// Работа с аргументами при помощи bind() и this

nav.addEventListener('mouseover', navLinksHoverAnimation.bind(0.4));
nav.addEventListener('mouseout', navLinksHoverAnimation.bind(1));

////////// Фиксированая навигация
const navHeight = nav.getBoundingClientRect().height;
const getStickyNav = function(entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }

};

const headerObserver = new IntersectionObserver(getStickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);


/////////  Появление секций сайта

const appearanceSection = function(entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(appearanceSection, {
  root: null,
  threshold: 0.05

});

allSection.forEach(function(section) {
  sectionObserver.observe((section));
  section.classList.add('section--hidden');
});

/////////  Имплементация ленивой загрузки изоброжений


const loadImages = function(entries, observer) {
  const entry = entries[0];
  console.log(entry);
  if (!entry.isIntersecting) return;

  // Меняем изображение на изображение с высоким разрешением

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};


const lazyImagesObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0.7
});

lazyImages.forEach(item => {
  lazyImagesObserver.observe(item);
});
console.log(lazyImages);


/////// Слайдер

const createDots = function() {
  slides.forEach(function(_, index) {
    dotContainer.insertAdjacentHTML('beforeend',
      `<button class='dots__dot' data-slide='${index}'></button> `);
  });
};

createDots();

const activateCurrentDot = function(slide) {
  document.querySelectorAll('.dots__dot')
    .forEach(item => item.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};

activateCurrentDot(0)

let currentSlide = 0;
const slidesNumber = slides.length;


const moveToSlide = function(slide) {
  slides.forEach(
    (s, index) => (s.style.transform = `translateX(${(index - slide) * 100}%)`)
  );
};

moveToSlide(0);

const nextSlide = function() {
  if (currentSlide === slidesNumber - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

const prevSlide = function() {
  if (currentSlide === 0) {
    currentSlide = slidesNumber - 1;
  } else {
    currentSlide--;
  }

  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};


btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e) {
  console.log(e);
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

dotContainer.addEventListener('click', function(e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activateCurrentDot(slide);
  }
});
/////////////////////  Работая с выбором, созданием, вставкой и удалением элиментов
// Выбор элиментов

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);
//
// console.log(document.querySelector('.header'));
// const section = document.querySelectorAll('.section');
// console.log(section);
//
// console.log(document.getElementById('section--1'));
// console.log(document.getElementsByTagName('button'));
// console.log(document.getElementsByClassName('btn'));


//////////////
// Создание и вставка элиментов
//
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'Мы используем на этом сайте cookie для улучшения функциональности';
// message.innerHTML = `Мы используем на этом сайте cookie для улучшения функциональности
//                      <button class='btn btn-close-cookie'>OK!</button>  `;
//
// const header = document.querySelector('.header');
//
// header.append(message);
// // header.before(message)
// // header.after(message)
//
//
// //////////////
// // Удаление элиментов
//
// document.querySelector('.btn-close-cookie').addEventListener('click', () => {
//   message.remove();
// });
//
//
// ///////////////////// Работа со стилями, атрибутами и классами
//
// //////////Стили
//
// message.style.backgroundColor = '#076785';
// message.style.width = '120%';
// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// message.style.height = '93px';
// console.log(message.style.height);
//
// // Кастомные свойства "Переменные" css
//
// // document.documentElement.style.setProperty
// // ('--color-first', 'yellow');
//
// ////////// Атрибуты
//
// const logo = document.querySelector('.nav__logo');
//
// // Получение стандартных атрибутов
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.getAttribute('src'));
// console.log(logo.className);
//
// // Изменение стандартных атрибутов
//
// logo.alt = 'Лого Банк';
//
// // Получение не стандартных атрибутов
//
// console.log(logo.getAttribute('developer'));
//
// // Создание не стандартных атрибутов
//
// logo.setAttribute('copyright', 'Master of Code');
//
// const link = document.querySelector('.nav__link--btn');
//
// console.log(link.href);
// console.log(link.getAttribute('href'));
//
// console.log(logo.dataset.versionNumber);
//
// // Классы
//
// logo.classList.add('a', 'b');
// logo.classList.remove('b');
// logo.classList.toggle('a');
// logo.classList.contains('c');


///////////////// Виды событий и обработчиков событий

// const h1 = document.querySelector('h1');
//
// const logMouseEnterH1 = function(e) {
//   console.log('addEventListener: Наводим на h1');
// };
//
// h1.addEventListener('mouseenter', logMouseEnterH1);
//
// setTimeout(() => {
//   h1.removeEventListener('mouseenter', logMouseEnterH1);
// }, 3000);

///////////////// Распространение событий (Event Propagation)

//
// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }
//
// const getRandomColor = () => `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`;
//
// // console.log(getRandoColor());
//
// document.querySelector('.nav__link').addEventListener('click', function(e) {
//   this.style.backgroundColor = getRandomColor();
//   console.log('lick', e.target, e.currentTarget);
//   console.log(this === e.currentTarget);
//   e.stopPropagation()
// });
// document.querySelector('.nav__links').addEventListener('click', function(e) {
//   this.style.backgroundColor = getRandomColor();
//   console.log('Nav-licks', e.target, e.currentTarget);
//   console.log(this === e.currentTarget);
//
// });
// document.querySelector('.nav').addEventListener('click', function(e) {
//   this.style.backgroundColor = getRandomColor();
//   console.log('Nav', e.target, e.currentTarget);
//   console.log(this === e.currentTarget);
//
// });

///////////////// Делигирование событий

//Правельный код для правной прокрутки скрола но он потребляет очень много производительности

// document.querySelectorAll('.nav__link').forEach(function(links) {
//   links.addEventListener('click', function(e) {
//     e.preventDefault();
//     const href = this.getAttribute('href');
//     console.log(href);
//     document.querySelector(href).scrollIntoView({
//       behavior: 'smooth'
//     });
//   });
// });


///////////////// Перемещение по DOM

//
// const h1 = document.querySelector('h1');
//
// // Перемещение вниз (К потомку)
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// console.log(h1.firstElementChild);
// h1.firstElementChild.style.color = 'red';
// console.log(h1.lastElementChild);
//
// // Перемещение вверх (К родителям)
//
// console.log(h1.parentElement);
// console.log(h1.parentNode);
//
// const h2 = document.querySelector('h2');
// console.log(h2);
//
// h2.closest('.section').style.backgroundColor = 'blue';
//
// // Перемещение на одном уровне (в стороны лево или право)
//
// console.log(h2.previousElementSibling);
// console.log(h2.nextElementSibling);
// console.log(h1.parentElement.children);

