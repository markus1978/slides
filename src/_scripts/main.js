// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

import $ from 'jquery';

const slides = () => $('.slide');
const slides_contents = (slide) => (slide || slides()).children('.slide-contents');

function calibrate() {
  // Find a body font size that renders all slides suitable for the given window resolution
  // Requires that all dynamic DOM elements have been added already.

  // Helper function that sets font-size css to an element
  const fontsize = (element, fontsize) => {
    element.css('font-size', `${fontsize}%`);
  };

  // We start with a very small font size; size is in %
  let current_max_font_size = Number.MAX_SAFE_INTEGER;
  const fontsize_increment = 10;

  slides().hide();
  slides().each((_, dom_slide) => {
    console.log("calibrate for slide...");
    const slide = $(dom_slide);
    const slide_contents = slides_contents(slide);
    slide.show();
    let test_font_size = 100;
    fontsize(slide_contents, test_font_size);
    let i = 0;
    while (slide_contents.height() < $(window).height() * 0.94) {
      test_font_size += fontsize_increment;
      fontsize(slide_contents, test_font_size);
      if (++i > 100) {
        console.log("Infinite loop!");
        break;
      }
    }
    slide.hide();
    current_max_font_size = Math.min(current_max_font_size, test_font_size - fontsize_increment);
  });

  // Set the font size to all slides
  fontsize(slides_contents(), current_max_font_size);
}

$(document).ready(function() {
  // wrap slide contents
  slides().wrapInner('<div class="slide-contents"></div>');
  slides().prepend('<section class=\"_before\"></section><section class=\"_after\"></section>');

  calibrate();
  slides().first().show();

  const slide_selector = '.slide';
  let active_slide = $(slide_selector).first();

  draw();

  $(window).keydown((event) => {
    if (event.keyCode === 37 || event.keyCode === 38) {
      back();
    } else if (event.keyCode === 39 || event.keyCode === 32 || event.keyCode === 40) {
      forward();
    } else {
      console.log("code: " + event.keyCode)
    }
  });

  $(window).mousedown((event) => {
    if (event.which === 1) {
      if (event.pageX / $(window).width() <= 0.2) {
        back();
      } else {
        forward();
      }
    }
  });

  $(window).resize(() => {
    calibrate();
    draw();
  });

  function forward() {
    let current_index = $(slide_selector).index(active_slide);
    if (current_index + 1 < $(slide_selector).length) {
      current_index++;
      go_to(current_index);
    }
  }

  function back() {
    let current_index = $(slide_selector).index(active_slide);
    if (current_index > 0) {
      current_index--;
      go_to(current_index);
    }
  }

  function go_to(slide) {
    active_slide = $(slide_selector).eq(slide);
    draw();
  }

  function draw() {
    active_slide.show();
    $(slide_selector).not(active_slide).hide();

    let current_slide_number = $(slide_selector).index(active_slide) + 1;
    let number_of_slides = $(slide_selector).length;
    $('#slide-numbers').html(current_slide_number + "/" + number_of_slides);
  }
});
