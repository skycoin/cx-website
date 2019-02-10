/*
 * Prefixes image source path so content creator doesn't have to.
 * Example: img.png -> ../assets/img/img.png
 */
export const imagePath = (md) => {
  md.renderer.rules.image = (tokens, id, options, env, self) => {
    const token = tokens[id];
    const src = token.attrGet('src');

    if (!(src.startsWith('//') || src.startsWith('http'))) {
      token.attrSet('src', '../assets/img/' + src);
    }

    return self.renderToken(tokens, id, options);
  };
};
