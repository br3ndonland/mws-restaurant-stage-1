# Focus

Udacity Google Mobile Web Specialist Nanodegree program part 1 lesson 11

Udacity [Web Accessibility by Google free course](https://www.udacity.com/course/web-accessibility--ud891)

Brendon Smith

[br3ndonland](https://github.com/br3ndonland)

## Table of Contents <!-- omit in toc -->

## Lesson

1. Introduction to Focus
    - [WebAIM standards](https://webaim.org/standards/wcag/checklist#sc2.1.1) say that all website functions should be accessible from the keyboard, unless they are functions that are not normally possible with the keyboard, like drawing.
2. What is Focus?
3. Quiz: Experiencing Focus
4. DOM Order Matters
    - Tab order corresponds to DOM order.
5. Quiz: Fixing DOM Order
6. Using Tabindex
    - Tabindex can be called on any HTML element, as you would a CSS class.
    - [`tabindex` on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
    - [W3C recommendation](https://www.w3.org/TR/html5/editing.html#sequential-focus-navigation-and-the-tabindex-attribute)
7. Deciding whats in focus
    - Tabindex should only be used for interactive elements. This would include:
      - Header and footer links
      - Search boxes
      - Forms
      - Buttons
8. Quiz: Which Elements Should Have Focus?
9. Managing Focus
    > You can skip ahead to Lesson 6 to learn how to change or remove the focus ring from an element. In this case, since we're managing focus and headers are typically not interactive it's probably OK to remove their focus ring. However, you should never remove the focus indicator from an interactive element unless you're going to replace it with something else. Otherwise a keyboard user might have no idea which element is currently focused!
10. Quiz: Manage Focus Yourself
    - The instructor uses the `focus()` method, which is now deprecated.

      ```js
      newPage.querySelector('h2').focus()
      ```

11. Skip Links
    - Skip links allow users to jump directly to the page content.
    - See [Google blog](https://developers.google.com/web/updates/2016/03/focus-start-point?hl=en).
12. Focus in Complex Components
13. Keyboard Design Patterns
14. Quiz: Implementing Keyboard Event Listeners
15. Offscreen Content
16. Quiz: Implementing Offscreen Content
17. Modals and Keyboard Traps
18. Lesson 2 Outro