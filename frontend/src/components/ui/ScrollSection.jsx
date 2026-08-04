import { motion } from 'framer-motion';
import { scrollRevealTransition, scrollViewport } from '../../theme/motion';

const ScrollSection = ({ children, delay = 0, y = 20, ...rest }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={scrollViewport}
    transition={scrollRevealTransition(delay)}
    {...rest}
  >
    {children}
  </motion.div>
);

export default ScrollSection;
