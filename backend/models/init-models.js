var DataTypes = require("sequelize").DataTypes;
var _bases = require("./bases");
var _cart_items = require("./cart_items");
var _categories = require("./categories");
var _complaints = require("./complaints");
var _contacts = require("./contacts");
var _conversations = require("./conversations");
var _favorite_posts = require("./favorite_posts");
var _messages = require("./messages");
var _order_detail = require("./order_detail");
var _order_status = require("./order_status");
var _orders = require("./orders");
var _packages = require("./packages");
var _post_detail = require("./post_detail");
var _posts = require("./posts");
var _transactions = require("./transactions");
var _user_reviews = require("./user_reviews");
var _users = require("./users");
var _variation_values = require("./variation_values");
var _variations = require("./variations");

function initModels(sequelize) {
  var bases = _bases(sequelize, DataTypes);
  var cart_items = _cart_items(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var complaints = _complaints(sequelize, DataTypes);
  var contacts = _contacts(sequelize, DataTypes);
  var conversations = _conversations(sequelize, DataTypes);
  var favorite_posts = _favorite_posts(sequelize, DataTypes);
  var messages = _messages(sequelize, DataTypes);
  var order_detail = _order_detail(sequelize, DataTypes);
  var order_status = _order_status(sequelize, DataTypes);
  var orders = _orders(sequelize, DataTypes);
  var packages = _packages(sequelize, DataTypes);
  var post_detail = _post_detail(sequelize, DataTypes);
  var posts = _posts(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var user_reviews = _user_reviews(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var variation_values = _variation_values(sequelize, DataTypes);
  var variations = _variations(sequelize, DataTypes);

  categories.belongsToMany(posts, { as: 'post_id_posts_post_details', through: post_detail, foreignKey: "variation_id", otherKey: "post_id" });
  posts.belongsToMany(categories, { as: 'variation_id_categories', through: post_detail, foreignKey: "post_id", otherKey: "variation_id" });
  posts.belongsToMany(users, { as: 'user_id_users', through: cart_items, foreignKey: "post_id", otherKey: "user_id" });
  posts.belongsToMany(users, { as: 'user_id_users_favorite_posts', through: favorite_posts, foreignKey: "post_id", otherKey: "user_id" });
  users.belongsToMany(posts, { as: 'post_id_posts', through: cart_items, foreignKey: "user_id", otherKey: "post_id" });
  users.belongsToMany(posts, { as: 'post_id_posts_favorite_posts', through: favorite_posts, foreignKey: "user_id", otherKey: "post_id" });
  posts.belongsTo(bases, { as: "base", foreignKey: "base_id"});
  bases.hasMany(posts, { as: "posts", foreignKey: "base_id"});
  post_detail.belongsTo(variations, { as: "variations", foreignKey: "variation_id"});
  categories.hasMany(post_detail, { as: "post_details", foreignKey: "variation_id"});
  posts.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(posts, { as: "posts", foreignKey: "category_id"});
  variations.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(variations, { as: "variations", foreignKey: "category_id"});
  posts.belongsTo(contacts, { as: "seller_contact", foreignKey: "seller_contact_id"});
  contacts.hasMany(posts, { as: "posts", foreignKey: "seller_contact_id"});
  messages.belongsTo(conversations, { as: "conversation", foreignKey: "conversation_id"});
  conversations.hasMany(messages, { as: "messages", foreignKey: "conversation_id"});
  complaints.belongsTo(order_detail, { as: "order_detail", foreignKey: "order_detail_id"});
  order_detail.hasMany(complaints, { as: "complaints", foreignKey: "order_detail_id"});
  transactions.belongsTo(order_detail, { as: "related_order_detail", foreignKey: "related_order_detail_id"});
  order_detail.hasMany(transactions, { as: "transactions", foreignKey: "related_order_detail_id"});
  user_reviews.belongsTo(order_detail, { as: "order_detail", foreignKey: "order_detail_id"});
  order_detail.hasMany(user_reviews, { as: "user_reviews", foreignKey: "order_detail_id"});
  order_detail.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(order_detail, { as: "order_details", foreignKey: "order_id"});
  order_status.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(order_status, { as: "order_statuses", foreignKey: "order_id"});
  transactions.belongsTo(orders, { as: "related_order", foreignKey: "related_order_id"});
  orders.hasMany(transactions, { as: "transactions", foreignKey: "related_order_id"});
  transactions.belongsTo(packages, { as: "related_package", foreignKey: "related_package_id"});
  packages.hasMany(transactions, { as: "transactions", foreignKey: "related_package_id"});
  users.belongsTo(packages, { as: "package", foreignKey: "package_id"});
  packages.hasMany(users, { as: "users", foreignKey: "package_id"});
  cart_items.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(cart_items, { as: "cart_items", foreignKey: "post_id"});
  favorite_posts.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(favorite_posts, { as: "favorite_posts", foreignKey: "post_id"});
  order_detail.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(order_detail, { as: "order_details", foreignKey: "post_id"});
  post_detail.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(post_detail, { as: "post_details", foreignKey: "post_id"});
  cart_items.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(cart_items, { as: "cart_items", foreignKey: "user_id"});
  complaints.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(complaints, { as: "complaints", foreignKey: "user_id"});
  contacts.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(contacts, { as: "contacts", foreignKey: "user_id"});
  conversations.belongsTo(users, { as: "customer", foreignKey: "customer_id"});
  users.hasMany(conversations, { as: "conversations", foreignKey: "customer_id"});
  conversations.belongsTo(users, { as: "seller", foreignKey: "seller_id"});
  users.hasMany(conversations, { as: "seller_conversations", foreignKey: "seller_id"});
  favorite_posts.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(favorite_posts, { as: "favorite_posts", foreignKey: "user_id"});
  orders.belongsTo(users, { as: "customer", foreignKey: "customer_id"});
  users.hasMany(orders, { as: "orders", foreignKey: "customer_id"});
  orders.belongsTo(users, { as: "seller", foreignKey: "seller_id"});
  users.hasMany(orders, { as: "seller_orders", foreignKey: "seller_id"});
  posts.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(posts, { as: "posts", foreignKey: "user_id"});
  transactions.belongsTo(users, { as: "receiver", foreignKey: "receiver_id"});
  users.hasMany(transactions, { as: "transactions", foreignKey: "receiver_id"});
  transactions.belongsTo(users, { as: "sender", foreignKey: "sender_id"});
  users.hasMany(transactions, { as: "sender_transactions", foreignKey: "sender_id"});
  user_reviews.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(user_reviews, { as: "user_reviews", foreignKey: "user_id"});
  post_detail.belongsTo(variation_values, { as: "variation_value", foreignKey: "variation_value_id"});
  variation_values.hasMany(post_detail, { as: "post_details", foreignKey: "variation_value_id"});
  variation_values.belongsTo(variation_values, { as: "parent", foreignKey: "parent_id"});
  variation_values.hasMany(variation_values, { as: "variation_values", foreignKey: "parent_id"});
  variation_values.belongsTo(variations, { as: "variation", foreignKey: "variation_id"});
  variations.hasMany(variation_values, { as: "variation_values", foreignKey: "variation_id"});

  return {
    bases,
    cart_items,
    categories,
    complaints,
    contacts,
    conversations,
    favorite_posts,
    messages,
    order_detail,
    order_status,
    orders,
    packages,
    post_detail,
    posts,
    transactions,
    user_reviews,
    users,
    variation_values,
    variations,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
