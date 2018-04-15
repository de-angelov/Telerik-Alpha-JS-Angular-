'use strict';
module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 256],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [4, 16384],
      },
    },
    isActive: {
     type: DataTypes.BOOLEAN,
     allowNull: false,
    },
  }, {});
  Job.associate = function(models) {
    const {
      JobCategory,
    }= models;
    Job.belongsTo( JobCategory, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'CASCADE',
    });
    JobCategory.hasMany( Job, {
      foreignKey: {
        allowNull: false,
      },
      oneDelete: 'CASCADE',
    });
  };
  return Job;
};
