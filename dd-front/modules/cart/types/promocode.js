import PropTypes from 'prop-types';

export default PropTypes.shape({
  promocode: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  discount: PropTypes.shape({
    type: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired,
  minSum: PropTypes.number
});
