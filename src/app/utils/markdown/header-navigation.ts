import { linkify } from '../string';

/*
 * Generates table-of-contents from h2 and h3 headers in the markdown document
 */
export const headerNavigation = (md) => {
  md.renderer.rules.heading_close = (tokens, id, options, env, self) => {
    const token = tokens[id];

    if (token.tag !== 'h1' || !env.headers) {
      return self.renderToken(tokens, id, options);
    }

    const headers = processHeaders(env.headers);

    return '</h1>' + generateNavigation(headers);
  };
};

export interface Header {
  title: string;
  level: number;
  children: Header[];
}

function generateNavigation(headers: Header[]) {
  let html = '<ul class="nav">';

  headers.forEach(header => {
    html += `<li class="h${header.level}"><a href="${generateLink(header.title)}">${header.title}</a></li>`;

    if (header.children.length > 0) {
      html += `<li class="sub">${generateNavigation(header.children)}</li>`;
    }
  });

  html += '</ul>';

  return html;
}

function generateLink(title: string) {
  return window.location.pathname + '#' + linkify(title);
}

function processHeaders(headers: Header[]) {
  const mainHeaders = [];
  let lastHeader: Header = null;

  headers.forEach(header => {
    if (header.level === 2) {
      mainHeaders.push(header);
      lastHeader = header;
    } else {
      lastHeader.children.push(header);
    }
  });

  return mainHeaders;
}

