## Intro
ASP.NET MVC product detail page using **HTML5**, **SCSS**, **Bootstrap 4**, and **jQuery**, plus a reusable **`$.toastMessage`** plugin for notifications.

## Using `toastMessage`
1. **Include**:
```html
<link rel="stylesheet" href="~/Content/toastMessage.css">
<script src="~/Scripts/jquery.min.js"></script>
<script src="~/Scripts/toastMessage.js"></script>
```
2. **Basic usage**:
```javascript
$.toastMessage('success', 'Item added to cart!');
$.toastMessage('error', 'Something went wrong.');
```
3. **Options**:
```javascript
$.toastMessage('success', 'Sticky toast', { sticky: true });
$.toastMessage('error', 'Closes in 5s', { duration: 5000 });
```
4. **Events**:
```javascript
$(document).on('toastShown', (e, el) => console.log('Shown:', el));
$(document).on('toastClosed', (e, el) => console.log('Closed:', el));
```

## Time Spent
~10 hours (study: 2h, UI: 3.5h, Interactivity: 2.5h, Plugin: 2h)

## Assumptions
- Product data hard-coded in ViewModel  
- Mockups followed with minor responsive tweaks  
- Toast supports `success` and `error` only
