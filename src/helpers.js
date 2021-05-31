const $helpers = {
  formatCurrency: (num) => {
    let formatter = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    })
    let formatted = formatter.format(Number(num))
    return formatted
  },
}

export default $helpers
