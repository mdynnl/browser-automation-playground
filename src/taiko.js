import process from 'node:process'
import t from 'taiko'
import { faker } from '@faker-js/faker'

try {
  /**
   * chrome --remote-debugging-port=9222
   */
  await t.openBrowser({ host: '0', port: 9222 })

  await t.openTab('http://demo.inertiajs.com/organizations/create', {
    waitForEvents: ['DOMContentLoaded'],
  })

  if (await t.button('Login').exists(100, 200)) {
    await login()
  }

  const name = await createOrg()
  await t.write(name, t.textBox('search'))

  const row = t.$('tr', t.near(t.link(name)))
  if (await row.exists()) {
    await t.highlight(row)
    await t.waitFor(2000)
  }
} catch (e) {
  console.error(e)
} finally {
  await t.closeTab()
  console.log('exiting')
  process.exit()
}

async function createOrg() {
  const name = faker.name.fullName()

  await t.write(name, t.textBox('Name:'))
  await t.write(faker.internet.email(), t.textBox('Email:'))
  await t.write(faker.phone.number(), t.textBox('Phone:'))
  await t.write(faker.address.streetAddress(true), t.textBox('Address:'))
  await t.write(faker.address.city(), t.textBox('City:'))
  await t.write(faker.address.state(), t.textBox('Province/State:'))
  await t.dropDown('Country:').select(1)
  await t.write(faker.address.zipCode(), t.textBox('Postal code:'))

  await t.click(t.button('Create Organization'), {
    waitForNavigation: true,
  })

  return name
}

async function login() {
  const demo_email = 'johndoe@example.com'
  const demo_password = 'secret'

  const input_email = t.textBox('Email:')
  const input_password = t.textBox('Password:')

  await t.clear(input_email)
  await t.write(demo_email, input_email)

  await t.clear(input_password)
  await t.write(demo_password, input_password)

  await t.checkBox('Remember Me').check()
  await t.click(t.button('Login'), {
    waitForEvents: ['DOMContentLoaded'],
  })
}
