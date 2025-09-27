var DataTypes = require("sequelize").DataTypes;
var _bases = require("./bases");
var _cart_items = require("./cart_items");
var _categories = require("./categories");
var _complaint_media = require("./complaint_media");
var _complaint_types = require("./complaint_types");
var _complaints = require("./complaints");
var _conversations = require("./conversations");
var _favorite_posts = require("./favorite_posts");
var _message_media = require("./message_media");
var _messages = require("./messages");
var _order_detail = require("./order_detail");
var _order_status = require("./order_status");
var _order_status_media = require("./order_status_media");
var _orders = require("./orders");
var _packages = require("./packages");
var _post_detail = require("./post_detail");
var _post_media = require("./post_media");
var _post_status = require("./post_status");
var _posts = require("./posts");
var _provinces = require("./provinces");
var _roles = require("./roles");
var _transactions = require("./transactions");
var _user_contacts = require("./user_contacts");
var _user_packages = require("./user_packages");
var _user_reviews = require("./user_reviews");
var _users = require("./users");
var _variation_values = require("./variation_values");
var _variations = require("./variations");
var _wards = require("./wards");

function initModels(sequelize) {
  var bases = _bases(sequelize, DataTypes);
  var cart_items = _cart_items(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var complaint_media = _complaint_media(sequelize, DataTypes);
  var complaint_types = _complaint_types(sequelize, DataTypes);
  var complaints = _complaints(sequelize, DataTypes);
  var conversations = _conversations(sequelize, DataTypes);
  var favorite_posts = _favorite_posts(sequelize, DataTypes);
  var message_media = _message_media(sequelize, DataTypes);
  var messages = _messages(sequelize, DataTypes);
  var order_detail = _order_detail(sequelize, DataTypes);
  var order_status = _order_status(sequelize, DataTypes);
  var order_status_media = _order_status_media(sequelize, DataTypes);
  var orders = _orders(sequelize, DataTypes);
  var packages = _packages(sequelize, DataTypes);
  var post_detail = _post_detail(sequelize, DataTypes);
  var post_media = _post_media(sequelize, DataTypes);
  var post_status = _post_status(sequelize, DataTypes);
  var posts = _posts(sequelize, DataTypes);
  var provinces = _provinces(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var user_contacts = _user_contacts(sequelize, DataTypes);
  var user_packages = _user_packages(sequelize, DataTypes);
  var user_reviews = _user_reviews(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var variation_values = _variation_values(sequelize, DataTypes);
  var variations = _variations(sequelize, DataTypes);
  var wards = _wards(sequelize, DataTypes);

  posts.belongsToMany(users, { as: 'user_id_users', through: cart_items, foreignKey: "post_id", otherKey: "user_id" });
  posts.belongsToMany(users, { as: 'user_id_users_favorite_posts', through: favorite_posts, foreignKey: "post_id", otherKey: "user_id" });
  posts.belongsToMany(variations, { as: 'variation_id_variations', through: post_detail, foreignKey: "post_id", otherKey: "variation_id" });
  users.belongsToMany(posts, { as: 'post_id_posts', through: cart_items, foreignKey: "user_id", otherKey: "post_id" });
  users.belongsToMany(posts, { as: 'post_id_posts_favorite_posts', through: favorite_posts, foreignKey: "user_id", otherKey: "post_id" });
  variations.belongsToMany(posts, { as: 'post_id_posts_post_details', through: post_detail, foreignKey: "variation_id", otherKey: "post_id" });
  orders.belongsTo(bases, { as: "base", foreignKey: "base_id"});
  bases.hasMany(orders, { as: "orders", foreignKey: "base_id"});
  posts.belongsTo(bases, { as: "base", foreignKey: "base_id"});
  bases.hasMany(posts, { as: "posts", foreignKey: "base_id"});
  posts.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(posts, { as: "posts", foreignKey: "category_id"});
  variations.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(variations, { as: "variations", foreignKey: "category_id"});
  complaints.belongsTo(complaint_types, { as: "conplaint_type_complaint_type", foreignKey: "conplaint_type"});
  complaint_types.hasMany(complaints, { as: "complaints", foreignKey: "conplaint_type"});
  complaint_media.belongsTo(complaints, { as: "complaint", foreignKey: "complaint_id"});
  complaints.hasMany(complaint_media, { as: "complaint_media", foreignKey: "complaint_id"});
  messages.belongsTo(conversations, { as: "conversation", foreignKey: "conversation_id"});
  conversations.hasMany(messages, { as: "messages", foreignKey: "conversation_id"});
  message_media.belongsTo(messages, { as: "message", foreignKey: "message_id"});
  messages.hasMany(message_media, { as: "message_media", foreignKey: "message_id"});
  complaints.belongsTo(order_detail, { as: "order_detail", foreignKey: "order_detail_id"});
  order_detail.hasMany(complaints, { as: "complaints", foreignKey: "order_detail_id"});
  transactions.belongsTo(order_detail, { as: "related_order_detail", foreignKey: "related_order_detail_id"});
  order_detail.hasMany(transactions, { as: "transactions", foreignKey: "related_order_detail_id"});
  user_reviews.belongsTo(order_detail, { as: "order_detail", foreignKey: "order_detail_id"});
  order_detail.hasMany(user_reviews, { as: "user_reviews", foreignKey: "order_detail_id"});
  order_status_media.belongsTo(order_status, { as: "status", foreignKey: "status_id"});
  order_status.hasMany(order_status_media, { as: "order_status_media", foreignKey: "status_id"});
  order_detail.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(order_detail, { as: "order_details", foreignKey: "order_id"});
  order_status.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(order_status, { as: "order_statuses", foreignKey: "order_id"});
  transactions.belongsTo(orders, { as: "related_order", foreignKey: "related_order_id"});
  orders.hasMany(transactions, { as: "transactions", foreignKey: "related_order_id"});
  transactions.belongsTo(packages, { as: "related_package", foreignKey: "related_package_id"});
  packages.hasMany(transactions, { as: "transactions", foreignKey: "related_package_id"});
  user_packages.belongsTo(packages, { as: "package", foreignKey: "package_id"});
  packages.hasMany(user_packages, { as: "user_packages", foreignKey: "package_id"});
  cart_items.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(cart_items, { as: "cart_items", foreignKey: "post_id"});
  favorite_posts.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(favorite_posts, { as: "favorite_posts", foreignKey: "post_id"});
  order_detail.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(order_detail, { as: "order_details", foreignKey: "post_id"});
  post_detail.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(post_detail, { as: "post_details", foreignKey: "post_id"});
  post_media.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(post_media, { as: "post_media", foreignKey: "post_id"});
  post_status.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(post_status, { as: "post_statuses", foreignKey: "post_id"});
  wards.belongsTo(provinces, { as: "province", foreignKey: "province_id"});
  provinces.hasMany(wards, { as: "wards", foreignKey: "province_id"});
  users.belongsTo(roles, { as: "role", foreignKey: "role_id"});
  roles.hasMany(users, { as: "users", foreignKey: "role_id"});
  orders.belongsTo(user_contacts, { as: "customer_contact", foreignKey: "customer_contact_id"});
  user_contacts.hasMany(orders, { as: "orders", foreignKey: "customer_contact_id"});
  orders.belongsTo(user_contacts, { as: "seller_contact", foreignKey: "seller_contact_id"});
  user_contacts.hasMany(orders, { as: "seller_contact_orders", foreignKey: "seller_contact_id"});
  posts.belongsTo(user_contacts, { as: "seller_contact", foreignKey: "seller_contact_id"});
  user_contacts.hasMany(posts, { as: "posts", foreignKey: "seller_contact_id"});
  cart_items.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(cart_items, { as: "cart_items", foreignKey: "user_id"});
  complaints.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(complaints, { as: "complaints", foreignKey: "user_id"});
  conversations.belongsTo(users, { as: "customer", foreignKey: "customer_id"});
  users.hasMany(conversations, { as: "conversations", foreignKey: "customer_id"});
  conversations.belongsTo(users, { as: "seller", foreignKey: "seller_id"});
  users.hasMany(conversations, { as: "seller_conversations", foreignKey: "seller_id"});
  favorite_posts.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(favorite_posts, { as: "favorite_posts", foreignKey: "user_id"});
  messages.belongsTo(users, { as: "sender", foreignKey: "sender_id"});
  users.hasMany(messages, { as: "messages", foreignKey: "sender_id"});
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
  user_contacts.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(user_contacts, { as: "user_contacts", foreignKey: "user_id"});
  user_packages.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(user_packages, { as: "user_packages", foreignKey: "user_id"});
  user_reviews.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(user_reviews, { as: "user_reviews", foreignKey: "user_id"});
  post_detail.belongsTo(variation_values, { as: "variation_value", foreignKey: "variation_value_id"});
  variation_values.hasMany(post_detail, { as: "post_details", foreignKey: "variation_value_id"});
  variation_values.belongsTo(variation_values, { as: "parent", foreignKey: "parent_id"});
  variation_values.hasMany(variation_values, { as: "variation_values", foreignKey: "parent_id"});
  post_detail.belongsTo(variations, { as: "variation", foreignKey: "variation_id"});
  variations.hasMany(post_detail, { as: "post_details", foreignKey: "variation_id"});
  variation_values.belongsTo(variations, { as: "variation", foreignKey: "variation_id"});
  variations.hasMany(variation_values, { as: "variation_values", foreignKey: "variation_id"});
  bases.belongsTo(wards, { as: "ward", foreignKey: "ward_id"});
  wards.hasMany(bases, { as: "bases", foreignKey: "ward_id"});
  user_contacts.belongsTo(wards, { as: "ward", foreignKey: "ward_id"});
  wards.hasMany(user_contacts, { as: "user_contacts", foreignKey: "ward_id"});

  return {
    bases,
    cart_items,
    categories,
    complaint_media,
    complaint_types,
    complaints,
    conversations,
    favorite_posts,
    message_media,
    messages,
    order_detail,
    order_status,
    order_status_media,
    orders,
    packages,
    post_detail,
    post_media,
    post_status,
    posts,
    provinces,
    roles,
    transactions,
    user_contacts,
    user_packages,
    user_reviews,
    users,
    variation_values,
    variations,
    wards,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
