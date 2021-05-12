import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { ModalProvider } from "contexts/modal/modal.provider";
import { Modal } from "@redq/reuse-modal";
import styled from "styled-components";
import { SEO } from "components/seo";
import {
  MainContentArea,
  SidebarSection,
  ContentSection,
  OfferSection,
  MobileCarouselDropdown,
} from "assets/styles/pages.style";
import { siteOffers } from "site-settings/site-offers";

import Carousel from "components/carousel/carousel";
import Link from "next/link";
import { getLocalState } from "utils/localStorage";

const CartPopUp = dynamic(() => import("features/carts/cart-popup"), {
  ssr: false,
});
const Sidebar = dynamic(() => import("layouts/sidebar/sidebar"));
const Products = dynamic(() =>
  import("components/product-grid/product-list/product-list")
);

function ShoesFilterPage(props) {
  const { deviceType, categories } = props;
  const router = useRouter();

  const { query } = router;
  const slugs = query?.slug;

  /**
   * function render ra cate Name , phục vụ render breadcrumb
   */
  const cateNames = slugs?.map((slug) => {
    if (slug?.includes("-")) {
      return slug
        ?.split("-")
        .map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
        .join(" ");
    } else {
      return slug?.charAt(0)?.toUpperCase() + slug?.slice(1);
    }
  });

  const cateId = cateNames.pop();

  const [totalProduct, setTotalProduct] = useState(null);
  const onTotalProduct = (value) => {
    setTotalProduct(value);
  };
  const localState = getLocalState("query");

  console.log("====================================");
  console.log("local state : ", localState);
  console.log("====================================");

  return (
    <>
      <SEO title="PAGE LEVEL 01" description="description for seo" />
      <ModalProvider>
        <Modal>
          <OfferSection>
            <div style={{ margin: "0 -10px" }}>
              <Carousel deviceType={deviceType} data={siteOffers} />
            </div>
          </OfferSection>
          <MobileCarouselDropdown>
            <Sidebar deviceType={deviceType} categoryId={router.query.cateid} />
          </MobileCarouselDropdown>

          <MainContentArea title="PHẦN NỘI DUNG CHÍNH">
            <SidebarSection title="PHẦN SIDE BAR BÊN TRÁI">
              <Sidebar deviceType={deviceType} type="shoes" cateId={cateId} />
            </SidebarSection>

            <ContentSection title="PHẦN LIST SẢN PHẨM BÊN PHẢI">
              <SectionTopRight>
                <ContentTop title="Hàng 1">
                  <BreadCrumb title="BreadCrumb Level 01">
                    <Link href="/">
                      <a>
                        <span className="icon_home">
                          <i className="fas fa-home-lg-alt"></i>
                        </span>
                      </a>
                    </Link>
                    {cateNames?.map((cateName, index) => {
                      return (
                        <span key={index}>
                          <span className="icon_right">
                            <i className="fal fa-chevron-right"></i>
                          </span>
                          <span className="cate_name">{cateName}</span>
                        </span>
                      );
                    })}
                  </BreadCrumb>

                  <TotalProduct>
                    Количество товаров: <strong>10812</strong>
                  </TotalProduct>
                </ContentTop>

                <SectionSortSideCateName title="Hàng 2">
                  <h1>{cateNames.slice(-1)[0]}</h1>
                  <SelectOption>
                    <Select>
                      <Option>Theo hàng mới</Option>
                      <Option>Theo hàng bán chạy</Option>
                      <Option>Theo hàng giảm giá</Option>
                      <Option>Từ rẻ đến đắt</Option>
                      <Option>Từ đắt đén rẻ</Option>
                    </Select>
                  </SelectOption>
                </SectionSortSideCateName>
              </SectionTopRight>

              <Products
                deviceType={deviceType}
                fetchLimit={20}
                cateId={cateId}
                onTotalProduct={onTotalProduct}
              />
            </ContentSection>
          </MainContentArea>

          <CartPopUp deviceType={deviceType} />
        </Modal>
      </ModalProvider>
    </>
  );
}

export default ShoesFilterPage;

const SectionTopRight = styled.div`
  display: flex;
  flex-direction: column;
  h1 {
    font-size: 30px;
    font-weight: 500;
    text-transform: uppercase;
    color: #213779;
    background: linear-gradient(90deg, #213779, #4fb7e4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  @media (max-width: 990px) {
    padding: 0 15px;
    h1 {
      font-size: 22px;
    }
  }
`;

const SectionSortSideCateName = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectOption = styled.div`
  position: relative;
  &:after {
    top: 50%;
    transform: translateY(-50%);
    right: 9px;
    position: absolute;
    content: "\f107";
    font-size: 16px;
    color: #000;
    font-family: "Font Awesome 5 Pro Regular";
  }
`;
const Select = styled.select`
  outline: none;
  width: 100%;
  padding-right: 30px !important;
  margin: 0;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: none;
  border-radius: 2px;
  padding: 9px 5px;
  border: 1px solid #c9c9c9;
  color: #213779;
  &:hover {
    border-color: #255eed;
    transition: 0.6s;
  }
`;
const Option = styled.option``;

const ContentTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  @media (max-width: 600px) {
    display: unset;
  }
`;
const TotalProduct = styled.div`
  font-size: 14px;
  @media (max-width: 600px) {
    margin-top: 15px;
    font-size: 10px;
  }
  strong {
    color: #213779;
  }
`;

const BreadCrumb = styled.div`
  display: flex;
  align-items: center;
  span.icon_home {
    cursor: pointer;
    color: #213779;
    font-size: 16px;
    margin-right: 8px;
    transition: 0.4s all ease-in-out;
    &:hover {
      color: #009e7f;
    }
  }
  span.icon_right {
    font-size: 16px;
    color: #e4e4e4;
    margin-right: 8px;
  }
  span.cate_name {
    font-size: 16px;
    font-weight: 600;
    color: #213779;
    margin-right: 8px;
  }
  @media (max-width: 600px) {
    display: unset;
    span.cate_name {
      font-size: 10px;
    }
  }
`;
