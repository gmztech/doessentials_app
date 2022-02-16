import {endpoints} from './endpoints';

const reqError = {
  method: {error: {message: 'Introduce un method'}},
  endpoint: {error: {message: 'Introduce un endpoint'}},
  body: {error: {message: 'Introduce un body'}},
};

const request = async opts => {
  try {
    const required = Object.keys(reqError).find(k =>
      !opts[k] ? opts[k] : null,
    );
    if (required) {
      return required;
    }
    if ((opts.method === 'POST' || opts.method === 'PUT') && !opts.body) {
      return reqError.body;
    }

    opts.headers = new Headers({
      'Content-Type': 'application/json',
      authorization: `Bearer ${opts.id}`,
    });

    if (opts.body) {
      opts.body = JSON.stringify(opts.body);
    }

    const res = await fetch(endpoints[opts.endpoint](opts), opts);
    return opts.fullRes ? res : res.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};

export {request};
