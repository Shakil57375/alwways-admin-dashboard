const BookCollection = ({ books = [] }) => {
  // If no books are provided, use a default empty array
  const bookItems = books.length > 0 ? books : [{ bookTitle: "Shanto Book", quantity: 10, price: 30 }]

  return (
    <div className="mt-4">
      <h3 className="font-semibold text-lg mb-3">Ordered Books</h3>
      <div className="space-y-3">
        {bookItems.map((book, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between">
              <span className="font-medium">{book.bookTitle}</span>
              <span className="text-[#8CAB91]">${book.price}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Quantity: {book.quantity}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between font-semibold">
        <span>Total:</span>
        <span>${bookItems.reduce((total, book) => total + book.price * book.quantity, 0)}</span>
      </div>
    </div>
  )
}

export default BookCollection



