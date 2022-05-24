const StyleDictionaryPackage = require('style-dictionary');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

StyleDictionaryPackage.registerFormat({
    name: 'css/variables',
    formatter: function (dictionary, config) {
      return `${this.selector} {
        ${dictionary.allProperties.map(prop => `  --${prop.name}: ${prop.value};`).join('\n')}
      }`
    }
  });  

StyleDictionaryPackage.registerTransform({
    name: 'size/pxToPx',
    type: 'value',
    matcher: function(prop) {
        return prop.value.match(/^[\d\.]+px$/);
    },
    transformer: function(prop) {
        return prop.value.replace(/px$/, 'px');
    }
});

function getStyleDictionaryConfig(theme) {
  return {
    "source": [
      `tokens/${theme}.json`,
    ],
    "platforms": {
      "web": {
        "transforms": ["attribute/cti", "name/cti/kebab", "size/pxToPx"],
        "buildPath": `output/`,
        "files": [{
            "destination": `${theme}.css`,
            "format": "css/variables",
            "selector": `.${theme}-theme`
          }]
      }
    }
  };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['global', 'dark', 'light'].map(function (theme) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${theme}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme));

    StyleDictionary.buildPlatform('web');

    console.log('\nEnd processing');
})

console.log('\n==============================================');
console.log('\nBuild completed!');
