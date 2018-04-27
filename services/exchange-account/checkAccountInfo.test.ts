import main from './checkAccountInfo'

describe('Check Account Info', () => {
  test('should store BNB balance', async () => {
    const accountInfoData = { balances: [ { asset: 'BNB', free: '1.11' } ] }
    const accountInfo = jest.fn().mockReturnValueOnce(Promise.resolve(accountInfoData))
    const updateAccount = jest.fn().mockReturnValueOnce(Promise.resolve(null))
    await main('test', { accountInfo, updateAccount })()

    expect(accountInfo).toHaveBeenCalledTimes(1)
    expect(updateAccount).toHaveBeenCalledTimes(1)
    expect(updateAccount).toHaveBeenCalledWith({
      id: 'test',
      data: { balances: { bnb: { amount: 1.11, lastCheckTime: expect.any(Number) } } }
    })
  })
})