import { linkify } from '../string';
import { Header } from './header-navigation';

/*
 * Prefixes headers with anchor tag <a name="header-title"></a>
 */
export const headerAnchors = (md) => {
  md.core.ruler.push('find_headers', state => {
    state.tokens
      .filter(token => /h[23]/.test(token.tag) && token.nesting === 1)
      .forEach(token => {
        const index = state.tokens.indexOf(token);

        const title = state.tokens[index + 1].children
          .filter(t => t.type === 'text' || t.type === 'code_inline')
          .reduce((acc, t) => acc + t.content, '');

        if (!state.env.headers) {
          state.env.headers = [];
        }

        state.env.headers.push(<Header>{
          title,
          level: Number(token.tag.substr(1)),
          children: [],
        });
      });
  });

  md.renderer.rules.heading_open = (tokens, id, options, env, self) => {
    const token = tokens[id];

    let name = tokens[id + 1].children
      .filter(t => t.type === 'text' || t.type === 'code_inline')
      .reduce((acc, t) => acc + t.content, '');

    name = linkify(name);

    return `<a name="${name}"></a><${token.tag} id="${name}">`;
  };
};
