<!-- spell-checker:ignore simmon -->

# Remedy CSS

A slightly modified version of [Jen Simmon's CSS Remedy](https://github.com/jensimmons/cssremedy), a simple CSS reset.

> CSS reset and normalization tools evolved from zeroing out styles to providing consistent, sensible defaults across browsers. CSS Remedy takes this further by overriding legacy browser defaults with modern CSS standards that browsers cannot implement themselves without breaking the older web.

## Usage

Simply import into your web page as the first CSS file.

### HTML Example

```html
<head>
    <link rel="stylesheet" href="remedy.css">
    <link rel="stylesheet" href="my-styles.css">
</head>
```

### CSS Example

```css
@import url(remedy.css);
```

## Compatibility

Will likely only work with modern ever-green web browsers, unlike the original version which supported IE 11.
