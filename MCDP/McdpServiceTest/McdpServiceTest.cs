using System;
using System.Collections.Generic;
using System.Linq;
using Moq;
using NUnit.Framework;
using Soti.MCDP.Database.Model;
using TestsHelper;

//namespace McdpServiceTest.Test
//{
//    /// <summary>
//    /// MCDP Service Test
//    /// </summary>
//    public class McdpServiceTest
//    {
//        #region Variables
//        private List<DataRow4Ida> _products;

//        #endregion

//        #region Test fixture setup
//        /// <summary>
//        /// Initial setup for tests
//        /// </summary>
//        [TestFixtureSetUp]
//        public void Setup()
//        {
//            _products = SetUpProducts();
//        }
//        #endregion

//        #region Setup

//        /// <summary>
//        /// Re-initializes test.
//        /// </summary>
//        [SetUp]
//        public void ReInitializeTest()
//        {
//            _products = SetUpProducts();


//        }

//        #endregion

//        #region Private member methods
//        /// <summary>
//        /// Setup dummy products data
//        /// </summary>
//        /// <returns></returns>
//        private static List<DataRow4Ida> SetUpProducts()
//        {
//            return DataInitializer.GetAll();
//        }

//        #endregion

//        #region Unit Tests

//        /// <summary>
//        /// Service should return all the products
//        /// </summary>
//        [Test]
//        public void GetAllProductsTest()
//        {
//            var products = _productService.GetAllProducts();
//            if (products != null)
//            {
//                var productList =
//                    products.Select(
//                        productEntity =>
//                        new Product { ProductId = productEntity.ProductId, ProductName = productEntity.ProductName }).
//                        ToList();
//                var comparer = new ProductComparer();
//                CollectionAssert.AreEqual(
//                    productList.OrderBy(product => product, comparer),
//                    _products.OrderBy(product => product, comparer), comparer);
//            }
//        }

//        /// <summary>
//        /// Service should return null
//        /// </summary>
//        [Test]
//        public void GetAllProductsTestForNull()
//        {
//            _products.Clear();
//            var products = _productService.GetAllProducts();
//            Assert.Null(products);
//            SetUpProducts();
//        }

//        #endregion


//        #region Tear Down

//        /// <summary>
//        /// Tears down each test data
//        /// </summary>
//        [TearDown]
//        public void DisposeTest()
//        {
//            _products = null;
//        }

//        #endregion

//        #region TestFixture TearDown.

//        /// <summary>
//        /// TestFixture teardown
//        /// </summary>
//        [TestFixtureTearDown]
//        public void DisposeAllObjects()
//        {
//            _products = null;
//        }

//        #endregion
//    }
//}
