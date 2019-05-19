import { mapActions, mapGetters, mapState } from 'vuex';

import feathersClient from 'feathers-client';

export default {
  computed: {
    ...mapState('wills', {
      areWillsLoading: 'isFindPending',
      willsPagination: 'pagination'
    }),
    ...mapGetters('wills', {
      findWillsInStore: 'find',
      listWills: 'list'
    })
  },
  methods: {
    ...mapActions('wills', {
      findWills: 'find'
    })
  },
  async created() {
    console.log('willsMixin was loaded');

    feathersClient.service('wills').on('created', data => {
      console.log(`Will created - ${data.title}`);
    });

    try {
      await this.findwills({});
      console.log('found wills');
    } catch (e) {
      console.error(e);
    }
  }
};
