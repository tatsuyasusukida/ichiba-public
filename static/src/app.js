class Main {
  async run () {
    const options = this.makeVueOptions(window.location.pathname)

    if (options) {
      const vm = new Vue(options)

      await vm.initialize()
      vm.$mount('#main')
    }
  }

  makeVueOptions (pathname) {
    return null
  }
}

main()

async function main () {
  try {
    await new Main().run()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  } 
}
