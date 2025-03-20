const mockComponent = (name) => {
    return function MockComponent(props) {
      return null;
    };
  };
  
  module.exports = new Proxy({}, {
    get: (target, prop) => {
      return mockComponent(prop);
    }
  });
