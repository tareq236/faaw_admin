const {
  DataTypes
} = require('sequelize');
const Sequelize = require("sequelize");

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "id"
    },
    membership_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "membership_number"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "name"
    },
    phone_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "phone_number"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "email"
    },
    session: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "session"
    },
    occupation: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "occupation"
    },
    organization_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "organization_name"
    },
    designation_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "designation_name"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "password"
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 1,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "status"
    },
    admin_approval: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "admin_approval"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "created_at"
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('NULL'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "updated_at"
    },
  };
  const options = {
    tableName: "member_list",
    comment: "",
    indexes: [],
    createdAt: false,
    updatedAt: false
  };
  return sequelize.define("MemberModel", attributes, options);
};
