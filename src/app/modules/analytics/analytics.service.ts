import { Analytics } from './analytics.model';
import Product from '../products/products.model';
import moment from 'moment';

const getTodayDateString = () => moment().format('YYYY-MM-DD');

const getTodayAnalytics = async () => {
  const date = getTodayDateString();
  let analytics = await Analytics.findOne({ date });
  if (!analytics) {
    analytics = await Analytics.create({ date });
  }
  return analytics;
};

const recordSiteVisit = async (payload: { isUnique: boolean }) => {
  const analytics = await getTodayAnalytics();
  analytics.totalVisits += 1;
  if (payload.isUnique) {
    analytics.uniqueVisitors += 1;
  }
  await analytics.save();
  return analytics;
};

const recordProductClick = async (productId: string) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { $inc: { clickCount: 1 } },
    { new: true }
  );
  return product;
};

const recordProductVisit = async (productId: string) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { $inc: { visitCount: 1 } },
    { new: true }
  );
  return product;
};

const recordAddToCart = async (productId: string) => {
  const analytics = await getTodayAnalytics();
  analytics.cartAdds += 1;
  await analytics.save();

  const product = await Product.findByIdAndUpdate(
    productId,
    { $inc: { cartAddCount: 1 } },
    { new: true }
  );
  return { analytics, product };
};

const recordAddToWishlist = async (productId: string) => {
  const analytics = await getTodayAnalytics();
  analytics.wishlistAdds += 1;
  await analytics.save();

  const product = await Product.findByIdAndUpdate(
    productId,
    { $inc: { wishlistAddCount: 1 } },
    { new: true }
  );
  return { analytics, product };
};

const getAnalyticsOverview = async () => {
  const today = await getTodayAnalytics();
  
  const totalStats = await Analytics.aggregate([
    {
      $group: {
        _id: null,
        totalVisits: { $sum: '$totalVisits' },
        uniqueVisitors: { $sum: '$uniqueVisitors' },
        cartAdds: { $sum: '$cartAdds' },
        wishlistAdds: { $sum: '$wishlistAdds' },
      },
    },
  ]);

  const past30Days = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const trends = await Analytics.find({ date: { $gte: past30Days } }).sort({ date: 1 });

  return {
    today,
    total: totalStats[0] || { totalVisits: 0, uniqueVisitors: 0, cartAdds: 0, wishlistAdds: 0 },
    trends,
  };
};

const getProductAnalytics = async () => {
  const mostClicked = await Product.find().sort({ clickCount: -1 }).limit(10).select('name clickCount images_urls');
  const mostVisited = await Product.find().sort({ visitCount: -1 }).limit(10).select('name visitCount images_urls');
  const mostCartAdded = await Product.find().sort({ cartAddCount: -1 }).limit(10).select('name cartAddCount images_urls');
  const mostWishlistAdded = await Product.find().sort({ wishlistAddCount: -1 }).limit(10).select('name wishlistAddCount images_urls');

  return {
    mostClicked,
    mostVisited,
    mostCartAdded,
    mostWishlistAdded,
  };
};

export const AnalyticsServices = {
  recordSiteVisit,
  recordProductClick,
  recordProductVisit,
  recordAddToCart,
  recordAddToWishlist,
  getAnalyticsOverview,
  getProductAnalytics,
};
