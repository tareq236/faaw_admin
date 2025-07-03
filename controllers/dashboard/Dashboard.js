const { sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");

exports.data = async (req, res, next) => {
  try {
    const categoryCounts = await sequelize.query(`
      SELECT
        c.id AS category_id,
        c.category_name,
        COUNT(m.id) AS member_count
      FROM
        member_list m
      INNER JOIN
        category_list c ON m.membership_category_id = c.id
      GROUP BY
        c.id, c.category_name
      ORDER BY
        member_count DESC
    `, {
      type: QueryTypes.SELECT
    });

    res.render('dashboard/index', {
      title: 'Dashboard',
      categoryCounts
    });
  } catch (err) {
    console.error("Error fetching category data:", err);
    next(err);
  }
};
