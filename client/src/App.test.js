import { render, screen } from '@testing-library/react'
import App from './App'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('GQL Todo Testing', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<App />)
  })

  test('Renders header', () => {
    expect(wrapper.find('h1').text()).toContain('GQL Todo')
  })

  test('Renders get button', () => {
    expect(wrapper.find('#get-user-btn').text()).toBe('Get user info')
  })

  // test('getAllUsers function fetches user information', async () => {
  //   wrapper.find('#get-user-btn').simulate('click');
  //   await Promise.resolve()
  // })
})
