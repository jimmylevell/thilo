import { Link as ReactRouterLink, useLocation } from 'react-router-dom'
import type { ChapterT } from './Chapter'
import type { SectionT } from './Section'

import { NavList, Truncate, Link} from '@primer/react'
import cx from 'classnames'

import { HomeIcon, BookmarkIcon, BookmarkFillIcon, RepoIcon, RepoCloneIcon, RepoPullIcon, RepoPushIcon, RepoLockedIcon, RepoForkedIcon, RepoDeletedIcon, RepoTemplateIcon } from '@primer/octicons-react'

import chapter_logo_test from '../images/chapter_logo_test.png'

type Props = {
    startPageMenuName?: String
    variant?: 'full' | 'overlay'
}

function SidebarNav(props: Props) {

    // location and navigate for browsing sections and chapters via hash links
    const location = useLocation()
    const sections = window.sections;

    
    const sectionListNavItems = sections.map(function (section: SectionT, index: number) {
        const sectionActive = location.pathname.replace('/', '') === section.slug;
        const id = `nav_item_${section.sorting}_${section.slug}`;
        
        // const sectionIndex = sections.findIndex((s: SectionT) => s.sorting === section.sorting)

        const icons = [RepoIcon, RepoCloneIcon, RepoPullIcon, RepoPushIcon, RepoLockedIcon, RepoForkedIcon, RepoDeletedIcon, RepoTemplateIcon];
        const DynamicIcon = icons[section.sorting % icons.length]
        console.log(DynamicIcon)

        const chapters = section.chapters
        const chapterNavItems = chapters.sort(function (a: ChapterT, b: ChapterT) {
            return a.sorting - b.sorting;
        }).map(function (chapter: ChapterT) {
            const isActive = location.hash.replace('#', '') === chapter.slug
            const id = `subnav_item_${chapter.sorting}_${chapter.slug_with_section}`;
            return (
                <NavList.Item 
                    // className={cx('ml-4', `${chapter.slug_with_section}`)} 
                    // aria-current={isActive && "page"}
                    key={id} id={id}
                    as={ReactRouterLink} to={(`${chapter.slug_with_section}`)}
                >
                    <NavList.LeadingVisual>
                    {isActive ? <BookmarkFillIcon/> : <BookmarkIcon/>}
                    </NavList.LeadingVisual>
                    {chapter.menu_name}
                </NavList.Item>
            )
        })

        return (
            <NavList.Item 
            id={id} key={id}
            className={cx(section.slug, sectionActive && 'active')} 
            aria-current={sectionActive && "page"}
            // FIXME: expand current section on page load does not work comme ca 
            aria-expanded={sectionActive}
            as={ReactRouterLink} to={section.slug}
            >
                <NavList.LeadingVisual>
                    {/* <DynamicIcon/> */}
                    <img src={chapter_logo_test} alt='chapter_logo_test' style={{width: '18px'}}/>
                </NavList.LeadingVisual>
                { chapterNavItems.length > 0
                    ? <Link as={ReactRouterLink} to={section.slug} sx={{color: 'unset'}}>
                        <Truncate title={section.menu_name} as='span' 
                        className='d-inline-block' maxWidth={200}
                        >
                            {section.menu_name}
                        </Truncate>
                    </Link>
                    : <Truncate title={section.menu_name} as='span' 
                    className='d-inline-block' maxWidth={200}
                    >
                        {section.menu_name}
                    </Truncate>
                }
                { chapterNavItems.length > 0 && <NavList.SubNav>
                    {chapterNavItems}
                </NavList.SubNav> }

            </NavList.Item>
            
        )
    });

    const isHome = location.pathname === '/'
    // special case for the home page which is not a section
    var classHome = isHome ? 'home active' : 'home' 
    const variant = props.variant;

    /* HACK: move to this?
        https://primer.style/react/TreeView
    */

    return (
        <div data-container="nav"
            className={cx(variant === 'full' ? 'position-sticky d-xxl-block d-lg-block d-none' : '')}
        >
            <NavList>
                <NavList.Item className={classHome} as={ReactRouterLink} to='/'>
                    <NavList.LeadingVisual><HomeIcon/></NavList.LeadingVisual> 
                    Home
                </NavList.Item>
                {sectionListNavItems}
            </NavList>
            <div
            className={cx(
            variant === 'overlay' ? 'd-xxl-none' : 'd-none d-lg-block d-xxl-block',
            
            )}
            >
            </div>
        </div>
    )
}

export default SidebarNav
