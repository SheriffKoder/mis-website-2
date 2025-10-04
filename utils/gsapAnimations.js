import gsap from "gsap";

/**
 * Collection of reusable GSAP animations
 */
export const animations = {
  /**
   * Fade in an element from transparent to fully visible
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   * @param {number} options.duration - Animation duration in seconds
   * @param {string|function} options.ease - GSAP easing function or custom easing
   * @param {number} options.delay - Delay before animation starts
   * @param {Function} options.onComplete - Callback function when animation completes
   * @returns {gsap.core.Tween} The GSAP tween instance
   */
  fadeIn: (target, options = {}) => {
    const {
      duration = 1.5,
      ease = "power2.inOut",
      delay = 0,
      onComplete,
      ...rest
    } = options;

    return gsap.fromTo(
      target,
      { opacity: 0 },
      { 
        opacity: 1, 
        duration, 
        ease, 
        delay,
        onComplete,
        ...rest
      }
    );
  },

  /**
   * Fade out an element from visible to transparent
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   * @returns {gsap.core.Tween} The GSAP tween instance
   */
  fadeOut: (target, options = {}) => {
    const {
      duration = 1,
      ease = "power2.inOut",
      delay = 0,
      onComplete,
      ...rest
    } = options;

    return gsap.to(
      target,
      { 
        opacity: 0, 
        duration, 
        ease, 
        delay,
        onComplete,
        ...rest
      }
    );
  },

  /**
   * Slide in an element from a direction
   * @param {string|Element} target - CSS selector or DOM element
   * @param {string} direction - "left", "right", "top", or "bottom"
   * @param {Object} options - Animation options
   * @returns {gsap.core.Tween} The GSAP tween instance
   */
  slideIn: (target, direction = "left", options = {}) => {
    const {
      duration = 1,
      ease = "power2.out",
      distance = 100,
      delay = 0,
      ...rest
    } = options;

    const startProps = { opacity: 0 };
    
    // Set starting position based on direction
    switch (direction) {
      case "left":
        startProps.x = -distance;
        break;
      case "right":
        startProps.x = distance;
        break;
      case "top":
        startProps.y = -distance;
        break;
      case "bottom":
        startProps.y = distance;
        break;
    }

    return gsap.fromTo(
      target,
      startProps,
      { 
        opacity: 1, 
        x: 0, 
        y: 0, 
        duration, 
        ease, 
        delay,
        ...rest
      }
    );
  },

  /**
   * Slide up animation - element moves up while fading in
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   * @returns {gsap.core.Tween} The GSAP tween instance
   */
  slideUp: (target, options = {}) => {
    const {
      duration = 1,
      ease = "power2.out",
      distance = 50,
      delay = 0,
      ...rest
    } = options;

    return gsap.fromTo(
      target,
      { 
        opacity: 0, 
        y: distance 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration, 
        ease, 
        delay,
        ...rest
      }
    );
  },

  /**
   * Slide down animation - element moves down while fading in
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   * @returns {gsap.core.Tween} The GSAP tween instance
   */
  slideDown: (target, options = {}) => {
    const {
      duration = 1,
      ease = "power2.out",
      distance = 50,
      delay = 0,
      ...rest
    } = options;

    return gsap.fromTo(
      target,
      { 
        opacity: 0, 
        y: -distance 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration, 
        ease, 
        delay,
        ...rest
      }
    );
  },

  /**
   * Scale animation - element scales up/down while fading in
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   * @returns {gsap.core.Tween} The GSAP tween instance
   */
  scale: (target, options = {}) => {
    const {
      duration = 1,
      ease = "power2.out",
      from = 0.5,
      to = 1,
      delay = 0,
      ...rest
    } = options;

    return gsap.fromTo(
      target,
      { 
        opacity: 0, 
        scale: from 
      },
      { 
        opacity: 1, 
        scale: to, 
        duration, 
        ease, 
        delay,
        ...rest
      }
    );
  },

  /**
   * Stagger animation - animate multiple elements with a stagger effect
   * @param {string|Element} targets - CSS selector or DOM elements
   * @param {Object} options - Animation options
   * @returns {gsap.core.Timeline} The GSAP timeline instance
   */
  stagger: (targets, options = {}) => {
    const {
      duration = 0.5,
      stagger = 0.1,
      from = "start",
      ease = "power1.out",
      y = 20,
      delay = 0,
      ...rest
    } = options;

    return gsap.fromTo(
      targets,
      { 
        opacity: 0, 
        y 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration, 
        stagger: { 
          amount: stagger, 
          from 
        }, 
        ease,
        delay,
        ...rest
      }
    );
  }
}; 