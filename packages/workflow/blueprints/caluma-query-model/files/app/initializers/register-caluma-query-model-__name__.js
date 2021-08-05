import Custom<%= classifiedModuleName %>Model from "<%= dasherizedPackageName %>/caluma-query/models/<%= dasherizedModuleName %>";

export function initialize(application) {
  application.register("caluma-query-model:<%= dasherizedModuleName %>", Custom<%= classifiedModuleName %>Model);
}

export default {
  initialize,
};
