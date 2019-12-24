import PropTypes from 'prop-types';

export default PropTypes.shape({
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired
      })
    ).isRequired
  }),
  qty: PropTypes.number.isRequired
}).isRequired;
