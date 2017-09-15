import Vue from 'vue';

import ToggleLink from '~/shared/components/toggle-link';
import EventBus from '~/utils/eventbus';

import NamespacesPanel from '../components/panel';
import NewNamespaceForm from '../components/new-form';

import NamespacesService from '../services/namespaces';

import NamespacesStore from '../store';

const { set } = Vue;

$(() => {
  if (!$('body[data-route="namespaces/index"]').length) {
    return;
  }

  // eslint-disable-next-line no-new
  new Vue({
    el: 'body[data-route="namespaces/index"] .vue-root',

    components: {
      NewNamespaceForm,
      NamespacesPanel,
      ToggleLink,
    },

    data() {
      return {
        state: NamespacesStore.state,
        username: window.currentUsername,
        normalNamespaces: [],
        specialNamespaces: [],
      };
    },

    methods: {
      onCreate(namespace) {
        const currentNamespaces = this.normalNamespaces;
        const namespaces = [
          ...currentNamespaces,
          namespace,
        ];

        set(this, 'normalNamespaces', namespaces);
      },

      loadData() {
        NamespacesService.all().then((response) => {
          const namespaces = response.data;

          const normalNamespaces = namespaces.filter(n => !n.global && n.name !== this.username);
          const specialNamespaces = namespaces.filter(n => n.global || n.name === this.username);

          set(this, 'normalNamespaces', normalNamespaces);
          set(this, 'specialNamespaces', specialNamespaces);
          set(this.state, 'isLoading', false);
        });
      },
    },

    mounted() {
      set(this.state, 'isLoading', true);
      this.loadData();
      EventBus.$on('namespaceCreated', namespace => this.onCreate(namespace));
    },
  });
});
