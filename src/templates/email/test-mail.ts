import striptags from 'striptags';
export function testMailTemplate(url: string) {
  return `
  <h1>Test</h1> 
  <p>It can use handlebars</p>
  <br /> 
  <b>Click <a href="${striptags(url)}">here</a> to visit the page</b>
  `;
}
